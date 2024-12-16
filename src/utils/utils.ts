import { ethers } from "ethers";

export async function calculateAverageBlockTime(provider: ethers.JsonRpcProvider, numBlocks: number = 10): Promise<number> {
  const latestBlock = await provider.getBlock("latest");
  if (!latestBlock) {
    throw new Error("Could not retrieve the latest block");
  }

  const pastBlock = await provider.getBlock(latestBlock.number - numBlocks);
  if (!pastBlock) {
    throw new Error("Could not retrieve the past block");
  }

  const averageBlockTime = (latestBlock.timestamp - pastBlock.timestamp) / numBlocks;
  return averageBlockTime; // Average time in seconds
}

export async function calculateDynamicDelay(provider: ethers.JsonRpcProvider, averageBlockTime: number): Promise<number> {
  const latestBlock = await provider.getBlock("latest");
  const currentTime = Math.floor(Date.now() / 1000);
  if (!latestBlock) {
    throw new Error("Could not retrieve the latest block");
  }
  const timeElapsedSinceLastBlock = currentTime - latestBlock.timestamp;

  const adjustedDelay = calculateDelayBeforeBlock(averageBlockTime) - timeElapsedSinceLastBlock * 1000;

  // Ensure the delay is non-negative
  return Math.max(adjustedDelay, 0);
}

export function calculateDelayBeforeBlock(averageBlockTime: number): number {
  if (averageBlockTime > 10) {
    return Math.max(averageBlockTime * 0.92, 10) * 1000; // For Ethereum network
  } else {
    return Math.max(averageBlockTime * 0.7, 1) * 1000;
  }
}