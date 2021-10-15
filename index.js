require('dotenv').config();
const { ethers, BigNumber } = require('ethers');
const { strategies, provider } = require('./strategies');
const { getGasPrice } = require('./gas');
const Sentry = require('@sentry/node');

const callCost = BigInt(10000000000000000); // in wei

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function harvestTrigger(strategy, callCostInWei) {
	return await strategy.harvestTrigger(callCostInWei);
}

async function harvest(contract) {
	const strategy = await contract.connect(signer);

	const sentryTransaction = Sentry.startTransaction({
		op: 'pre-harvest',
		name: 'Catch if Harvest would fail',
	});

	try {
		await strategy.callStatic.harvest();
	} catch (error) {
		Sentry.captureException(error);
		console.error('Error occured, check Sentry for details');
		return;
	}

	// estimate the gas of transaction
	const estimatedGas = await strategy.estimateGas.harvest();

	// mutliple that value with 1.3
	const gasLimit = estimatedGas.add(
		estimatedGas.mul(BigNumber.from(3)).div(BigNumber.from(10))
	);
	const gasPrice = await getGasPrice();

	sentryTransaction.finish();

	const transaction = await strategy.harvest({ gasLimit: gasLimit, gasPrice: gasPrice });
	console.log(`Tx Hash: ${transaction.hash}`);
	console.log(`Waiting for the transaction to be mined...`);
	await transaction.wait();
	console.log(`Transaction confirmed!\n`);
}

async function main() {
	const sentryTransaction = Sentry.startTransaction({
		op: 'harvest',
		name: 'Catch Harvest failed transactions',
	});

	console.log(`Check for harvest started...\n`);

	for (const [contract, name] of strategies.entries()) {
		console.log(`Checking: ${name}`);
		const shouldHarvest = await harvestTrigger(contract, callCost);
		if (shouldHarvest) {
			console.log(`Trying to harvest...`);
			try {
				await harvest(contract);
			} catch (error) {
				Sentry.captureException(error);
				console.error('Error occured, check Sentry for details');
			}
		} else {
			console.log(`Strategy doesn't need harvesting\n`);
		}
	}

	sentryTransaction.finish();
}

function exec() {
	const sentryTransaction = Sentry.startTransaction({
		op: 'general',
		name: 'Catch general errors',
	});

	main()
		.then(() =>
			console.log(
				`Harvest check done, next in ${process.env.CHECK_INTERVAL} miliseconds\n`
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

exec();

setInterval(() => exec(), process.env.CHECK_INTERVAL);
