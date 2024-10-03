import { Neurosity } from "@neurosity/sdk";
import "dotenv/config";
import robot from "robotjs";
// Reference the Neurosity SDK docs if you want more info
// on how to add other functionality https://docs.neurosity.co/docs/overview

// Make sure that you created the .env file and added your data there
// Don't touch the lines below
const deviceId = process.env.NEUROSITY_DEVICE_ID || "";
const email = process.env.NEUROSITY_EMAIL || "";
const password = process.env.NEUROSITY_PASSWORD || "";

const neurosity = new Neurosity({
  deviceId,
});

const main = async () => {
  await neurosity
    .login({
      email,
      password,
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
  console.log("Logged in");
};

neurosity.kinesis("tongue").subscribe(async (intent) => {
  // Change the number below to change the probility match for
  // firing off the code in the if statement
  const confidenceMatch = intent.confidence > 0.9;
  if (confidenceMatch) {
    // Simulate pressing the escape key
    robot.keyTap("space");
    // robot.keyToggle("space", "down") // this will hold down space and not let go
    console.log("We escaped!");
  }
});

main();
