require('dotenv').config();
const { ethers, BigNumber } = require('ethers');
const { strategies, provider } = require('./strategies');
const { getGasPrice } = require('./gas');
const Sentry = require('@sentry/node');
const { METHODS_TO_EXECUTE } = require('./constants');

// Call cost in wei, zero for now while it's subsidized by Tesseract.fi
const callCost = BigInt(0);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function harvestTrigger(strategy, callCostInWei) {
	return await strategy.harvestTrigger(callCostInWei);
}

async function tendTrigger(strategy, callCostInWei) {
	return await strategy.tendTrigger(callCostInWei);
}

/**
 * @param contract Strategy contract instance
 * @param method ENUM which method to execute from METHODS_TO_EXECUTE
 * */
async function execute(contract, method) {
	const strategy = await contract.connect(signer);
	const isMethodHarvest = method === METHODS_TO_EXECUTE.harvest;

	const sentryTransaction = Sentry.startTransaction({
		op: 'pre-' + method,
		name: 'Catch if ' + method + ' would fail',
	});

	try {
		if (isMethodHarvest) {
			await strategy.callStatic.harvest();
		} else {
			await strategy.callStatic.tend();
		}
	} catch (error) {
		Sentry.captureException(error);
		console.error('Error occured, check Sentry for details');
		return;
	}

	// estimate the gas of transaction
	let estimatedGas = 0;
	if (isMethodHarvest) {
		estimatedGas = await strategy.estimateGas.harvest()
	} else {
		estimatedGas = await strategy.estimateGas.tend()
	}

	// mutliple that value with 1.3
	const gasLimit = estimatedGas.add(
		estimatedGas.mul(BigNumber.from(3)).div(BigNumber.from(10))
	);
	const gasPrice = await getGasPrice();

	sentryTransaction.finish();

	const nonce = await signer.getTransactionCount();

	const txParams = {
		gasLimit: gasLimit,
		gasPrice: gasPrice,
		nonce: nonce
	}

	let transaction;
	if (isMethodHarvest) {
		transaction = await strategy.harvest(txParams);
	} else {
		transaction = await strategy.tend(txParams);
	}

	console.log(`Tx Hash: ${transaction.hash}`);
	console.log(`Waiting for the transaction to be mined...`);
	await transaction.wait();
	console.log(`Transaction confirmed!\n`);
}

async function main(method) {
	const isMethodHarvest = method === METHODS_TO_EXECUTE.harvest;

	const sentryTransaction = Sentry.startTransaction({
		op: method,
		name: 'Catch ' + method + ' failed transactions',
	});

	console.log('Check for ' + method + ' started...\n');

	for (const [contract, name] of strategies.entries()) {
		console.log(`Checking: ${name}`);
		let shouldExecute = false;

		if (isMethodHarvest) {
			shouldExecute = await harvestTrigger(contract, callCost);
		} else {
			shouldExecute = await tendTrigger(contract, callCost);
		}

		if (shouldExecute) {
			console.log('Trying to ' + method + '...');
			try {
				await execute(contract, method)
			} catch (error) {
				Sentry.captureException(error);
				console.error('Error occured, check Sentry for details');
			}
		} else {
			console.log('Strategy doesn\'t need ' + method + '\n');
		}
	}

	sentryTransaction.finish();
}

function exec(method, interval) {
	const sentryTransaction = Sentry.startTransaction({
		op: 'general',
		name: 'Catch general errors',
	});

	main(method)
		.then(() =>
			console.log(
				`Harvest check done, next in ${interval} miliseconds\n`
			)
		)
		.catch((error) => {
			Sentry.captureException(error);
			console.error('Error occured, check Sentry for details');
		})
		.finally(() => sentryTransaction.finish());
}

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
});

console.log('🚀 Keeper bot script is up & running\n');

const harvestInterval = process.env.HARVEST_CHECK_INTERVAL;
const tendInterval = process.env.TEND_CHECK_INTERVAL;

exec(METHODS_TO_EXECUTE.harvest, harvestInterval);

setInterval(() => exec(METHODS_TO_EXECUTE.harvest, harvestInterval), harvestInterval);
setInterval(() => exec(METHODS_TO_EXECUTE.tend, tendInterval), tendInterval);
