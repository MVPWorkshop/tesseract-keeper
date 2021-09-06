require('dotenv').config();
const { ethers } = require('ethers');
const { strategies } = require('./strategies');

const intervalPeriod = 3600000; // 1 hour
const callCost = BigInt(10000000000000000);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

async function harvestTrigger(strategy, callCostInWei) {
	return await strategy.harvestTrigger(callCostInWei);
}

async function harvest(strategy) {
	const transaction = await strategy.connect(signer).harvest();
	console.log(`Tx Hash: ${transaction.hash}\n`);
	console.log(`Waiting for the transaction to be mined...`);
	await transaction.wait();
	console.log(`Transaction confirmed!\n`);
}

async function main() {
	console.log(`Check for harvest started...\n`);
	for (const [contract, name] of strategies.entries()) {
		console.log(`Checking: ${name}`);
		const shouldHarvest = await harvestTrigger(contract, callCost);
		console.log(shouldHarvest);
		if (shouldHarvest) {
			console.log(`Trying to harvest...`);
			harvest(contract);
		} else {
			console.log(`Strategy doesn't need harvesting\n`);
		}
	}
}

console.log('Keeper bot script is up & running\n');

setInterval(() => {
	main()
		.then(() =>
			console.log(`Harvest check done, next in ${intervalPeriod} miliseconds\n`)
		)
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}, intervalPeriod);
