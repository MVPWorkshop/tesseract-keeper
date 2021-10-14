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
