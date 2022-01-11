const {BigNumber} = require("ethers");
const {formatUnits} = require("ethers/lib/utils");
const {provider} = require("./strategies");

async function getGasPrice() {
  const maxGasPrice = BigNumber.from(process.env.MAX_GAS_PRICE);
  let gasPrice = BigNumber.from(process.env.DEFAULT_GAS_PRICE);

  try {
    let priceWei = await provider.getGasPrice();

    const priceGwei = formatUnits(priceWei, "gwei");
    console.log(`Date: ${new Date()}, Gas price: ${priceGwei}`);

    gasPrice = priceWei;
  } catch {}

  if (gasPrice.lt(maxGasPrice)) {
    return gasPrice;
  } else {
    return maxGasPrice;
  }
}

module.exports = {
  getGasPrice: getGasPrice
}
