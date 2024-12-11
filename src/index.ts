import { setupWallets } from "./menu/setupWallet";
import { importContractInfo } from "./menu/importContract";
import { scheduleMinting } from "./menu/scheduleMint";
import { startBot } from "./menu/startBot";
import inquirer from "inquirer";
import WalletManager from "./wallet/wallet";


async function main() {
  let exit = false;
  let walletManager : WalletManager | null = null;
  let contractDetails : {
    contractAddress: string;
    functionName: string;
    parameterTypes: string[];
    parameters: string[];
    value: string;
  } | null = null;
  let timestamp : number | null = null;

  while (!exit) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Setup a default wallet", value: "setupWallet" },
          { name: "Import contract info", value: "importContract" },
          { name: "Set the exact time for minting", value: "scheduleMinting" },
          { name: "Start the bot", value: "startBot" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "setupWallet":
        walletManager = await setupWallets();
        break;

      case "importContract":
        contractDetails = await importContractInfo();
        break;

      case "scheduleMinting":
        timestamp = await scheduleMinting();
        break;

      case "startBot":
        if (!walletManager) {
          console.error("You must set up a wallet before starting the bot.");
          break;
        }
        if (!contractDetails) {
          console.error("You must import contract details before starting the bot.");
          break;
        }
        if (!timestamp) {
          console.error("You must schedule a minting time before starting the bot.");
          break;
        }
        await startBot(walletManager, contractDetails, timestamp);
        break;

      case "exit":
        exit = true;
        break;
    }
  }
};

main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
