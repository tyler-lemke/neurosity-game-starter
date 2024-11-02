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

const keyboardDelay = 200;
robot.setKeyboardDelay(keyboardDelay); //set keyboard delay for each keypress

neurosity.kinesis("mentalMath").subscribe(async (intent) => {
  //dial in the confidence
  const confidenceMatch = intent.confidence > 0.7;
  //key you want to be pressed
  // all of the available keys you can use https://robotjs.io/docs/syntax#keyboard
  const actionKey = "space";
  if (confidenceMatch) {
    robot.keyTap(actionKey);
    console.log(`${actionKey} pressed with ${keyboardDelay}ms of delay`);
  }
});

main();
