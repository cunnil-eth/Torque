import WalletManager from "../wallet/wallet";
import { performMinting } from "../mint/minting";
import inquirer from "inquirer";
import { encodeFunctionCall } from "../mint/contract";
import { checkBlockNativeStatus } from "../utils/utils";

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
  try {
    const provider = walletManager.getProvider();
    const chainId = (await provider.getNetwork()).chainId;
    const txData = encodeFunctionCall(
      contractInfo.functionName, 
      contractInfo.parameterTypes, 
      contractInfo.parameters
    );
    const status = await checkBlockNativeStatus(chainId);

    const currentTimestamp = Date.now();
    const delay = scheduledTimestamp - currentTimestamp;

    if (delay < 0) {
      throw new Error("The scheduled time is in the past. Please set valid time.");
    }

    console.log(`Scheduled to start minting in ${Math.ceil(delay / 1000)} seconds...`);

    timeoutId = setTimeout(async () => {
      try {
        await walletManager.performParallelAction((wallet) => 
          performMinting(
            wallet,
            provider,
            chainId,
            status,
            contractInfo.contractAddress,
            txData,
            contractInfo.value
          )
        );
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
  } catch (err : unknown) {
    const error = err as Error;
    console.error("Error:", error.message)
  }
}
