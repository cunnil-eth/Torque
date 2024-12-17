import { ethers } from "ethers";
import { encodeFunctionCall } from "./contract";
import { calculateAverageBlockTime, calculateDynamicDelay } from "../utils/utils";
import { fetchGasPriceFromBlockNative } from "../blockchain/gas";

export const performMinting = async (
  wallet: ethers.Wallet,
  provider: ethers.JsonRpcProvider,
  contractAddress: string,
  functionName: string,
  parameterTypes: string[],
  parameters: string[],
  value: string
) => {
  console.log(`Minting with wallet ${wallet.address}...`);

  const averageBlockTime = await calculateAverageBlockTime(provider);
  
  const dynamicDelay = await calculateDynamicDelay(provider, averageBlockTime);

  setTimeout(async () => {
    console.log("Fetching optimal gas prices...");
    const gasPrices = await fetchGasPriceFromBlockNative(provider);

    const tx = {
      to: contractAddress,
      data: encodeFunctionCall(functionName, parameterTypes, parameters),
      value: ethers.parseEther(value),
      maxFeePerGas: gasPrices.maxFeePerGas,
      maxPriorityFeePerGas: gasPrices.maxPriorityFeePerGas,
    };

    const transaction = await wallet.sendTransaction(tx);

    console.log(`Minting initiated. Transaction Hash: ${transaction.hash}`);
    await transaction.wait();
    console.log(`Minting completed for wallet ${wallet.address}.`);
  }, dynamicDelay);
};