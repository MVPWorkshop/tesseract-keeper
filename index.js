require('dotenv').config();
const { ethers } = require('ethers');
const { strategies, provider } = require('./strategies');
const Sentry = require('@sentry/node');

const callCost = BigInt(10000000000000000); // in wei

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function harvestTrigger(strategy, callCostInWei) {
	return await strategy.harvestTrigger(callCostInWei);
}

async function harvest(strategy) {
	const transaction = await strategy.connect(signer).harvest();
	console.log(`Tx Hash: ${transaction.hash}`);
	console.log(`Waiting for the transaction to be mined...`);
	await transaction.wait();
	console.log(`Transaction confirmed!\n`);
}

async function main() {
	console.log(`Check for harvest started...\n`);
	for (const [contract, name] of strategies.entries()) {
		console.log(`Checking: ${name}`);
		const shouldHarvest = await harvestTrigger(contract, callCost);
		if (shouldHarvest) {
			console.log(`Trying to harvest...`);
			await harvest(contract);
		} else {
			console.log(`Strategy doesn't need harvesting\n`);
		}
	}
}

function exec() {
	const sentryTransaction = Sentry.startTransaction({
		op: 'harvest',
		name: 'Catch Harvest failed transactions',
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

console.log('Keeper bot script is up & running\n');

exec();

setInterval(() => exec(), process.env.CHECK_INTERVAL);
