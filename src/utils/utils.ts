import axios from "axios";
import { ethers } from "ethers";

export async function calculateDynamicDelay(provider: ethers.JsonRpcProvider, averageBlockTime: number): Promise<number> {
  if (averageBlockTime == 1) { 
    return 0; // For Arbitrum
  } else {
    const latestBlock = await provider.getBlock("latest");
    const currentTime = Date.now();
    if (!latestBlock) {
      throw new Error("Could not retrieve the latest block");
    }
    const timeElapsedSinceLastBlock = currentTime - latestBlock.timestamp * 1000;

    const adjustedDelay = (averageBlockTime - 1.5) * 1000 - timeElapsedSinceLastBlock;

    // Ensure the delay is non-negative in ms
    return Math.max(adjustedDelay, 0);
  }
}

export function getAverageBlockTime(chainId : bigint): number {
  if (chainId == 1n || chainId == 11155111n) {
    return 12;
  } else if (chainId == 42161n) {
    return 1;
  } else if (chainId == 56n) {
    return 3;
  } else {
    return 2;
  }
}

export async function checkBlockNativeStatus (chainId: bigint) {
  try {
    const response = await axios.get(
      `https://api.blocknative.com/gasprices/blockprices?chainid=${chainId}`,
      {
        headers: {
          Authorization: process.env.BLOCKNATIVE_API,
        }
      }
    );
    return response.status; // Return the status code if needed
  } catch (error: unknown) {
    console.error("Error occurred while pinging BlockNative:", (error as Error).message);
  }
}