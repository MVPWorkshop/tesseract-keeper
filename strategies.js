const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(
	process.env.JSON_RPC_PROVIDER
);

// ABIs
const strategyGenLevAaveAbi = require('./abis/StrategyGenLevAave.abi.json');

// Addresses on Polygon Main Net
const strategyGenLevAaveUsdcAddress = `0x5Eab952D5a81067EBb9F1E2348382E34805b7e53`;
const strategyGenLevAaveDaiAddress = `0x901f316658Fb49F54de72eE2621C1789074D37E9`;
const strategyGenLevAaveWbtcAddress = `0xE6951cef4968F03D42A6c30683F102A5cEb59B82`;
const strategyGenLevAaveWethAddress = `0x623a24146F65d7Bf68e47b355d92FE84190F30C0`;

// v0.4.3.1
const strategyGenLevAaveV2UsdcAddress = `0xb1A092293290E60B288B2B75D83a1a086392C037`;
const strategyGenLevAaveV2DaiAddress = `0xb32A63f4F713Ab83a23d8c464e2a1a5AF10Acb89`;
const strategyGenLevAaveV2WbtcAddress = `0x3790283EF6cDc310EA42F3C98039444aB9195c16`;
const strategyGenLevAaveV2WethAddress = `0x9552efE8985749C0A292926dfF50f8895f19A3ED`;
const strategyGenLevAaveV2WmaticAddress = `0x85486d270Aa0329978F1EFbba4e807E489a86260`;

const leverageAaveFactory = (strategyAddress) => {
	return new ethers.Contract(
		strategyAddress,
		strategyGenLevAaveAbi,
		provider
	);
}

// Export strategies
const strategies = new Map([
	[leverageAaveFactory(strategyGenLevAaveUsdcAddress), 'Leveraged AAVE - USDC Strategy'],
	[leverageAaveFactory(strategyGenLevAaveDaiAddress), 'Leveraged AAVE - DAI Strategy'],
	[leverageAaveFactory(strategyGenLevAaveWbtcAddress), 'Leveraged AAVE - WBTC Strategy'],
	[leverageAaveFactory(strategyGenLevAaveWethAddress), 'Leveraged AAVE - WETH Strategy'],
	[leverageAaveFactory(strategyGenLevAaveV2UsdcAddress), 'Leveraged AAVE V2 - USDC Strategy'],
	[leverageAaveFactory(strategyGenLevAaveV2DaiAddress), 'Leveraged AAVE V2 - DAI Strategy'],
	[leverageAaveFactory(strategyGenLevAaveV2WbtcAddress), 'Leveraged AAVE V2 - WBTC Strategy'],
	[leverageAaveFactory(strategyGenLevAaveV2WethAddress), 'Leveraged AAVE V2 - WETH Strategy'],
	[leverageAaveFactory(strategyGenLevAaveV2WmaticAddress), 'Leveraged AAVE V2 - WMATIC Strategy'],
]);

module.exports = {
	strategies: strategies,
	provider: provider,
};
