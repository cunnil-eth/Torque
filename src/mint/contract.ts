import inquirer from "inquirer";
import { ethers } from "ethers";

export const getContractDetails = async (): Promise<{
    contractAddress: string;
    functionName: string;
    parameterTypes: string[];
    parameters: string[];
    value: string;
  }> => {
    const contractInputs = await inquirer.prompt([
      {
        type: "input",
        name: "contractAddress",
        message: "Enter the contract address:",
        validate: (input) => (ethers.isAddress(input) ? true : "Invalid address."),
      },
      {
        type: "input",
        name: "functionName",
        message: "Enter the function name (e.g., mint):",
        validate: (input) => (input ? true : "Function name is required."),
      },
      {
        type: "input",
        name: "parameterTypes",
        message: "Enter the parameter types (comma-separated, e.g., uint256,string):",
        filter: (input) => input.split(",").map((type : string) => type.trim()),
      },
      {
        type: "input",
        name: "parameters",
        message: "Enter the function parameters (comma-separated, e.g., param1,param2):",
        filter: (input) => input.split(",").map((param : string) => param.trim()),
      },
      {
        type: "input",
        name: "value",
        message: "Enter the amount of ETH to mint (or 0 if free, point-separated, e.g., 0.1):",
        default: "0",
        validate: (input) => (!isNaN(parseFloat(input)) && parseFloat(input) >= 0 ? true : "Invalid ETH value."),
      },
    ]);
  
    return contractInputs;
};

export const encodeFunctionCall = (functionName: string, parameterTypes: string[], parameters: string[]): string => {
  const sanitizedParameterTypes = parameterTypes.filter(type => type !== "");
  const sanitizedParameters = parameters.filter(param => param !== "");

  if (sanitizedParameterTypes.length !== sanitizedParameters.length) {
    throw new Error("Mismatch between parameter types and parameters.");
  }

  return ethers.concat([
    ethers.id(`${functionName}(${sanitizedParameterTypes.join(",")})`).slice(0,10),
    new ethers.AbiCoder().encode(sanitizedParameterTypes, sanitizedParameters),
  ]) 
}