import { BaseWallet, ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

class WalletManager {
    private provider: ethers.JsonRpcProvider;
    private wallets: ethers.Wallet[] = [];
  
    constructor(rpcUrl: string) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
  
    // Load a wallet from a private key
    loadWallet(privateKey: string): ethers.Wallet {
      return new ethers.Wallet(privateKey, this.provider);
    }
  
    // Load the default wallet from the .env file
    loadDefaultWallet(): ethers.Wallet {
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        throw new Error("Default wallet private key is not defined in .env");
      }
      return this.loadWallet(privateKey);
    }

    // Load batch wallets from a file
    loadWalletsFromFile(filePath: string) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const privateKeys = fileContent.split("\n").map((key) => key.trim()).filter(Boolean);

      this.wallets = privateKeys.map((key) => this.loadWallet(key));
      console.log(`${this.wallets.length} wallets loaded from file.`)
      console.log("--------------------------------------------------------");
    }

    getProvider(): ethers.JsonRpcProvider {
      return this.provider;
    }

    // Perform a parallel action with all wallets
    async performParallelAction(action: (wallet: ethers.Wallet) => Promise<void>) {
      const walletsToProcess = [this.loadDefaultWallet(), ...this.wallets];
      await Promise.allSettled(
        walletsToProcess.map(async (wallet) => {
          try {
            await action(wallet);
          } catch (err : unknown) {
            const error = err as Error;
            console.error(`Error with ${wallet.address}:`, error.message);
          }
        })
      );
    }
  
    // Check wallet balance
    async getBalance(wallet: BaseWallet): Promise<string> {
      const balance = await this.provider.getBalance(wallet.address);
      return ethers.formatEther(balance).slice(0, 7);
    }

    // Check balance for all wallets in wallets.txt
    async checkBalances() {
        for (const wallet of this.wallets) {
          const balance = await this.getBalance(wallet);
          console.log(`${wallet.address} | ${balance} ETH`);
        }
    }
  }
  
  export default WalletManager;