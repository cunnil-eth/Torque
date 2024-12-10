import { getContractDetails } from "../mint/contract";
import fs from "fs";

const CONTRACT_INFO_FILE = "./src/mint/contract.json";

export const importContractInfo = async () => {
    if (fs.existsSync(CONTRACT_INFO_FILE)) {
        const contractInfo = JSON.parse(fs.readFileSync(CONTRACT_INFO_FILE, "utf-8"));
        console.log("Loaded contract info from file:", contractInfo);
        return contractInfo;
    }
    
    const contractDetails = await getContractDetails();
    console.log("Contract details imported successfully!");
  
    fs.writeFileSync(CONTRACT_INFO_FILE, JSON.stringify(contractDetails, null, 2));
    return contractDetails
};