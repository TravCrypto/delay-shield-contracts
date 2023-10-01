import { Contract } from "ethers";
import fs from "fs";
import path from "path";

import { abi } from "../out/DelayShield.sol/DelayShield.json";
import { signer } from "./helpers/connection";

const { CONSUMER_ADDRESS } = process.env;
const subscriptionId = "539"; // TODO @dev

const sendRequest = async () => {
  // Attach to the FunctionsConsumer contract
  const functionsConsumer = new Contract(CONSUMER_ADDRESS!, abi, signer);

  const source = fs
    .readFileSync(path.resolve(__dirname, "./functions.js"))
    .toString();

  const callbackGasLimit = 300000;

  // get the request ID by simulating a Tx with a static call
  const requestTx = await functionsConsumer.claimInsurance(
    source,
    signer.address,
    "AD7372", // flight code
    subscriptionId,
    callbackGasLimit,
    { gasPrice: 8000000000, gasLimit: 2100000 }
  );

  const requestTxReceipt = await requestTx.wait(1);

  console.log(requestTxReceipt);
};

sendRequest().catch((err: any) => {
  console.log("Error sending the request to Functions Consumer: ", err);
});
