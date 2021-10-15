const fetch = require("node-fetch");
const {BigNumber} = require("ethers");
const {parseUnits} = require("ethers/lib/utils");

async function getGasPrice() {
  const maxGasPrice = BigNumber.from(process.env.MAX_GAS_PRICE);
  let gasPrice = BigNumber.from(process.env.DEFAULT_GAS_PRICE);

  try {
    const response = await fetch(process.env.GAS_STATION, { method: "get" });
    const data = await response.json();

    if (data && data.fast && data.fast > 0) {
      const priceGwei = data.fast.toString();
      const priceWei = parseUnits(priceGwei, "gwei");

      if (priceWei.gt(gasPrice)) {
        gasPrice = priceWei;
      }
    }
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
