import { ethers } from "ethers";
import { encodeFunctionCall } from "./contract";

export const performMinting = async (
    wallet: ethers.Wallet,
    contractAddress: string,
    functionName: string,
    parameterTypes: string[],
    parameters: string[],
    value: string
  ) => {
    console.log(`Minting with wallet ${wallet.address}...`);
  
    // Encode function call
    const data = encodeFunctionCall(functionName, parameterTypes, parameters);
  
    // Prepare transaction
    const tx = await wallet.sendTransaction({
      to: contractAddress,
      data,
      value: ethers.parseEther(value),
    });
  
    console.log(`Minting initiated. Transaction Hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Minting completed for wallet ${wallet.address}.`);
};