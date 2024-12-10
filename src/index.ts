import { setupDefaultWallet } from "./menu/setupWallet";
import { importContractInfo } from "./menu/importContract";
import { scheduleMinting } from "./menu/scheduleMint";
import inquirer from "inquirer";

async function main() {
  let exit = false;

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
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "setupWallet":
        await setupDefaultWallet();
        break;

      case "importContract":
        await importContractInfo();
        break;

      case "scheduleMinting":
        await scheduleMinting();
        break;

      case "exit":
        exit = true;
        console.log("Terminated");
        break;

      default:
        console.log("Invalid option. Please try again.");
    }
  }
};

main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
