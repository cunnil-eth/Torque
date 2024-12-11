import { getContractDetails } from "../mint/contract";

export const importContractInfo = async () => {
  const contractDetails = await getContractDetails();
  console.log("*******************************************")
  console.log("/ Contract details imported successfully! /");
  console.log("*******************************************")
  
  return contractDetails
};