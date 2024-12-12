import * as fs from "fs";
import WalletManager from "../wallet/wallet";

const configPath = "src/config/config.json"

export const saveConfig = async (
  walletManager: WalletManager,
  contractInfo: {
    contractAddress: string;
    functionName: string;
    parameterTypes: string[];
    parameters: string[];
    value: string;
  },
  scheduledTimestamp: number
) => {
  const config = {
    walletManager,
    contractInfo,
    scheduledTimestamp,
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log("*************************************");
  console.log("/ Configuration saved successfully! /");
  console.log("*************************************");
};

export const loadConfig = async (): Promise<{
walletManager: WalletManager;
  contractInfo: {
    contractAddress: string;
    functionName: string;
    parameterTypes: string[];
    parameters: string[];
    value: string;
  };
  scheduledTimestamp: number;
}> => {
  try {
    if (!fs.existsSync(configPath)) {
      console.log("Configuration file not found. Please save a configuration first.");
      return Promise.reject(new Error("Configuration file missing."));
    }
  
    const configContent = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configContent);
  
    if (
      !config.walletAddress ||
      !config.contractInfo ||
      !config.scheduledTimestamp
    ) {
      console.log("Configuration file is incomplete or corrupted.");
      return Promise.reject(new Error("Configuration file corrupted."));
    }
  
    console.log("**************************************");
    console.log("/ Configuration loaded successfully! /");
    console.log("**************************************");

    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Error parsing configuration file. It may be corrupted.");
    } else {
      console.error("An unexpected error occurred while loading the configuration.");
    }
    return Promise.reject(error);
  }
};
