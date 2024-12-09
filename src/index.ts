import { ethers } from "ethers";
import * as dotenv from "dotenv";
import inquirer from "inquirer";
import { networks } from "./blockchain/networks";

dotenv.config();

const getRpcUrl = (network: string): string => {
    const apiKey = process.env.RPC_API;
    if (!apiKey) throw new Error("RPC_API is not defined in .env");
    return `https://${network}.infura.io/v3/${apiKey}`;
};

async function main() {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "network",
        message: "Select the network:",
        choices: Object.keys(networks),
      },
    ]);
  
    const selectedNetwork = networks[answers.network];
    const rpcUrl = getRpcUrl(selectedNetwork);
  
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error("Wallet private key not provided");
    const wallet = new ethers.Wallet(privateKey as string, provider);
  
    console.log("Primary Wallet:", wallet.address);
    console.log("Selected Network:", answers.network);
};

main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
