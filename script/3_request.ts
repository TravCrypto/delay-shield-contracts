import { Contract, encodeBytes32String } from "ethers";
import fs from "fs";
import path from "path";

import { abi } from "../out/DelayShield.sol/DelayShield.json";
import { Location } from "@chainlink/functions-toolkit";
import { signer } from "./helpers/connection";

const consumerAddress = "0xc8e5398cF3DCE36bEA91035658ED3C4bb03BC090"; // TODO @dev get this from step 01
const encryptedSecretsReference = ""; // TODO @dev get this from previous step
const subscriptionId = "539"; // TODO @dev

const sendRequest = async () => {
  if (!consumerAddress || !subscriptionId) {
    throw new Error("Please set the variables in script 04");
  }

  // Attach to the FunctionsConsumer contract
  const functionsConsumer = new Contract(consumerAddress, abi, signer);

  const source = fs
    .readFileSync(path.resolve(__dirname, "./functions.js"))
    .toString();

  const callbackGasLimit = 300000;

  // get the request ID by simulating a Tx with a static call
  const requestTx = await functionsConsumer.claimInsurance(
    source, // source
    "0x2a4fc9c5ec629d872f82d29fae5dfa71b39b7e28",
    "AD7372", // bytesArgs - arguments can be encoded off-chain to bytes.
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
