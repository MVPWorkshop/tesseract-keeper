const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(
	process.env.JSON_RPC_PROVIDER
);

// ABIs
const leveragedAaveUsdcAbi = require('./abis/LeveragedAaveUsdc.abi.json');
const leveragedAaveDaiAbi = require('./abis/LeveragedAaveDai.abi.json');
const leveragedAaveUsdtAbi = require('./abis/LeveragedAaveUsdt.abi.json');
const leveragedAaveWbtcAbi = require('./abis/LeveragedAaveWbtc.abi.json');
const leveragedAaveWethAbi = require('./abis/LeveragedAaveWbtc.abi.json');

// Addresses on Polygon Main Net
const leveragedAaveUsdcAddress = '0x4e88B4f358406b5cd36622771Fd427d719f6f5fC';
const leveragedAaveDaiAddress = '0xEbB24DAACC8e5CE6c137Aa64c55a3e7cFa0FBF4D';
const leveragedAaveUsdtAddress = '0x09bf4D210dC9d95A1115443DEd3554eeF48a10E9';
const leveragedAaveWbtcAddress = '0x5Dd3b8f3141186B5bAfAFbaD9cBf26ffC6116C91';
const leveragedAaveWethAddress = '0xcf26db4f3bB6b75E2E7222676931E815D465195C';

// Contract instances
const leveragedAaveUsdc = new ethers.Contract(
	leveragedAaveUsdcAddress,
	leveragedAaveUsdcAbi,
	provider
);

const leveragedAaveDai = new ethers.Contract(
	leveragedAaveDaiAddress,
	leveragedAaveDaiAbi,
	provider
);

const leveragedAaveUsdt = new ethers.Contract(
	leveragedAaveUsdtAddress,
	leveragedAaveUsdtAbi,
	provider
);

const leveragedAaveWbtc = new ethers.Contract(
	leveragedAaveWbtcAddress,
	leveragedAaveWbtcAbi,
	provider
);

const leveragedAaveWeth = new ethers.Contract(
	leveragedAaveWethAddress,
	leveragedAaveWethAbi,
	provider
);

// Export strategies
const strategies = new Map([
	// [leveragedAaveUsdc, 'Leveraged AAVE - USDC Strategy'],
	// [leveragedAaveDai, 'Leveraged AAVE - DAI Strategy'],
	// [leveragedAaveUsdt, 'Leveraged AAVE - USDT Strategy'],
	[leveragedAaveWbtc, 'Leveraged AAVE - WBTC Strategy'],
	[leveragedAaveWeth, 'Leveraged AAVE - WETH Strategy'],
]);

module.exports = {
	strategies: strategies,
	provider: provider,
};
