import { ethers } from "ethers";
import { calculateDynamicDelay, getAverageBlockTime } from "../utils/utils";
import { fetchGasPriceFromBlockNative } from "../blockchain/gas";

export const performMinting = async (
  wallet: ethers.Wallet,
  provider: ethers.JsonRpcProvider,
  chainId: bigint,
  status: number | undefined,
  contractAddress: string,
  txData: string,
  value: string
) => {
  console.log(`Minting with wallet ${wallet.address}...`);

  try {
    const averageBlockTime = getAverageBlockTime(chainId);
    const dynamicDelay = await calculateDynamicDelay(provider, averageBlockTime);

    setTimeout(async () => {
      try {
        console.log("Fetching optimal gas prices...");
        
        let gasPrices;
        if (status == 400) {
          try {
            // Attempt to fetch gas prices from BlockNative
            gasPrices = await fetchGasPriceFromBlockNative(chainId);
            console.log(`BlockNative gas prices:`, gasPrices);
          } catch (err : unknown) {
            const error = err as Error;
            console.error("BlockNative API failed. Falling back to eth_gasPrice.", error.message);

            // Fallback to provider's gas price
            const fallbackGasPrice = await provider.getFeeData();
            gasPrices = {
              maxFeePerGas: fallbackGasPrice.maxFeePerGas,
              maxPriorityFeePerGas: fallbackGasPrice.maxFeePerGas
            }
            console.log(`Fallback gas prices:`, gasPrices);
          }
        } else {
          const fallbackGasPrice = await provider.getFeeData();
            gasPrices = {
              maxFeePerGas: fallbackGasPrice.maxFeePerGas,
              maxPriorityFeePerGas: fallbackGasPrice.maxFeePerGas
            }
            console.log(`Fallback gas prices:`, gasPrices);
        }

        const tx = {
          to: contractAddress,
          data: txData,
          value: ethers.parseEther(value),
          maxFeePerGas: gasPrices.maxFeePerGas,
          maxPriorityFeePerGas: gasPrices.maxPriorityFeePerGas,
        };
        
        const transaction = await wallet.sendTransaction(tx);
      
        console.log(`Minting initiated. Transaction Hash: ${transaction.hash}`);
        await transaction.wait();
        console.log(`Minting completed for wallet ${wallet.address}.`);
      } catch (err : unknown) {
        const error = err as Error;
        console.error(`Minting failed for wallet ${wallet.address}: ${error.message}`)
      }
    }, dynamicDelay);

  } catch (err : unknown) {
    const error = err as Error;
    console.error("Error during minting process:", error.message);
  }
};