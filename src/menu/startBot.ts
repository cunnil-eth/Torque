import WalletManager from "../wallet/wallet";
import { performMinting } from "../mint/minting";
import inquirer from "inquirer";

let timeoutId: NodeJS.Timeout | null = null;

export const startBot = async (
  walletManager: WalletManager, 
  contractInfo: {
    contractAddress: string;
    functionName: string;
    parameterTypes: string[];
    parameters: string[];
    value: string;
  },
  scheduledTimestamp : number
) => {
  const currentTimestamp = Date.now();
  const delay = scheduledTimestamp - currentTimestamp;

  if (delay < 0) {
    console.error("The scheduled time is in the past. Please set valid time.");
    return null;
  }
  
  console.log(`Scheduled to start minting in ${Math.ceil(delay / 1000)} seconds...`);

  timeoutId = setTimeout(async () => {
    try {
      await walletManager.performParallelAction((wallet) => 
        performMinting(
          wallet,
          contractInfo.contractAddress,
          contractInfo.functionName,
          contractInfo.parameterTypes,
          contractInfo.parameters,
          contractInfo.value
        )
      );

      console.log("Minting process completed!");
    } catch (err : unknown) {
      const error = err as Error;
      console.error("Error during minting process:", error.message);
    }
  }, delay);

  while (delay > 0) {
    const { cancel } = await inquirer.prompt([
      {
        type: "confirm",
        name: "cancel",
        message: "Press Y to cancel the minting",
        default: false,
      },
    ]);

    if (cancel && timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      return;
    }
  }
}
