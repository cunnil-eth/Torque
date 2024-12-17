const networks : Record<string, string> = {
    "Ethereum Mainnet": "mainnet",
    "Ethereum Sepolia": "sepolia",
    "Arbitrum Mainnet": "arbitrum-mainnet",
    "Optimism Mainnet": "optimism-mainnet",
    "Base Mainnet": "base-mainnet",
    "BSC Mainnet": "bsc-mainnet"
};

const getRpcUrl = (network: string): string => {
    const apiKey = process.env.RPC_API;
    if (!apiKey) throw new Error("RPC_API is not defined in .env");
    return `https://${network}.infura.io/v3/${apiKey}`;
};

export { networks, getRpcUrl };