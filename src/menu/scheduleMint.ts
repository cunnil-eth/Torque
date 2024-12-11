import inquirer from "inquirer";
import { parse } from "date-fns";

export const scheduleMinting = async () => {
  const { readableTime } = await inquirer.prompt([
    {
      type: "input",
      name: "readableTime",
      message: "Enter the minting time in local timezone (format: YYYY-MM-DD HH:mm:ss):",
      validate: (input) => {
        const date = parse(input, "yyyy-MM-dd HH:mm:ss", new Date());
        return isNaN(date.getTime()) ? "Invalid date format." : true;
      },
    },
  ]);

  // Convert to UNIX timestamp
  const timestamp = parse(readableTime, "yyyy-MM-dd HH:mm:ss", new Date()).getTime();

  console.log("**************************************************************************************");
  console.log(`Minting scheduled for: ${new Date(timestamp)} `);
  console.log("**************************************************************************************");

  return timestamp;
};