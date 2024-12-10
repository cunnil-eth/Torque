import inquirer from "inquirer";
import WalletManager from "../wallet/wallet";
import { getRpcUrl, networks } from "../blockchain/networks";

export const setupDefaultWallet = async () => {
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

    const walletManager = new WalletManager(rpcUrl);
    
    const wallet = walletManager.loadDefaultWallet();

    const balance = await walletManager.getBalance(wallet);
  
    console.log("Primary Wallet:", wallet.address);
    console.log("Selected Network:", answers.network);
    console.log("Wallet Balance:", balance, "ETH");

    walletManager.loadWalletsFromFile("src/wallet/wallets.txt");
    await walletManager.checkBalances();
};