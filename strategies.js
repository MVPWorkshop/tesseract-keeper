const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(
	process.env.JSON_RPC_PROVIDER
);

// ABIs
const strategyGenLevAaveAbi = require('./abis/StrategyGenLevAave.abi.json');

// Addresses on Polygon Main Net
const strategyGenLevAaveUsdcAddress = `0x5Eab952D5a81067EBb9F1E2348382E34805b7e53`;
const strategyGenLevAaveDaiAddress = `0xC1fa844991963Babd2f6f4AFAa021553E5762E49`;
const strategyGenLevAaveWbtcAddress = `0xBA95038Bca1175a56Ef5f887A60627B7caf55b9c`;
const strategyGenLevAaveWethAddress = `0x2Bea1Ead72bD0B9609Ae0fAbeb79CcCe636FFB4c`;

// Contract instances
const leveragedAaveUsdc = new ethers.Contract(
	strategyGenLevAaveUsdcAddress,
	strategyGenLevAaveAbi,
	provider
);

const leveragedAaveDai = new ethers.Contract(
	strategyGenLevAaveDaiAddress,
	strategyGenLevAaveAbi,
	provider
);

const leveragedAaveWbtc = new ethers.Contract(
	strategyGenLevAaveWbtcAddress,
	strategyGenLevAaveAbi,
	provider
);

const leveragedAaveWeth = new ethers.Contract(
	strategyGenLevAaveWethAddress,
	strategyGenLevAaveAbi,
	provider
);

// Export strategies
const strategies = new Map([
	[leveragedAaveUsdc, 'Leveraged AAVE - USDC Strategy'],
	[leveragedAaveDai, 'Leveraged AAVE - DAI Strategy'],
	[leveragedAaveWbtc, 'Leveraged AAVE - WBTC Strategy'],
	[leveragedAaveWeth, 'Leveraged AAVE - WETH Strategy'],
]);

module.exports = {
	strategies: strategies,
	provider: provider,
};
