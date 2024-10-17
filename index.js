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

const keyboardDelay = 50;
robot.setKeyboardDelay(keyboardDelay); //set keyboard delay for each keypress

neurosity.kinesis("mentalMath").subscribe(async (intent) => {
  //dial in the confidence
  const confidenceMatch = intent.confidence > 0.7;
  //key you want to be pressed
  const actionKey = "space";
  if (confidenceMatch) {
    robot.keyTap(actionKey);
    console.log(`${actionKey} pressed with ${keyboardDelay}ms of delay`);
  }
});

let alreadyToggled = false;
neurosity.kinesis("tongue").subscribe(async (intent) => {
  const enableConfidenceMatch = intent.confidence > 0.9;
  const disableConfidenceMatch = intent.confidence < 0.4;
  const actionKey = "space";

  if (enableConfidenceMatch && !alreadyToggled) {
    robot.keyToggle(actionKey, "down");
    console.log(`${actionKey} Key Toggled!`);
    alreadyToggled = true;
  } else if (disableConfidenceMatch) {
    robot.keyToggle(actionKey, "up");
    alreadyToggled = false;
    console.log(`${actionKey} Key Untoggled!`);
  }
});
main();
