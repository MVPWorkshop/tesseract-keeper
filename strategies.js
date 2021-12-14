const { ethers } = require('ethers');

if (!process.env.STRATEGIES_LIST) {
	throw new Error("Please provide environment with a strategies list")
}

const strategyList = JSON.parse(process.env.STRATEGIES_LIST);
console.log(strategyList)
const provider = new ethers.providers.JsonRpcProvider(
	process.env.JSON_RPC_PROVIDER
);

// ABIs
const strategyAbi = require('./abis/BaseStrategy.abi.json');

const strategyFactory = (strategyAddress) => {
	return new ethers.Contract(
		strategyAddress,
		strategyAbi,
		provider
	);
}

// Export strategies
const strategies = new Map();

for (let i = 0; i < strategyList.length; i++) {
	const strategy = strategyList[i];

	strategies.set(strategy.name, strategyFactory(strategy.address))
}

module.exports = {
	strategies: strategies,
	provider: provider,
};
