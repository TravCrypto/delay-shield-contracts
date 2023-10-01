import { Contract, encodeBytes32String } from "ethers";
import fs from "fs";
import path from "path";

import { abi } from "../out/DelayShield.sol/DelayShield.json";
import { Location } from "@chainlink/functions-toolkit";
import { signer } from "./helpers/connection";

const consumerAddress = "0xf38e8be75e114e7e0d153d5a87c50274a0ea4db2"; // TODO @dev get this from step 01
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
  const requestTx = await functionsConsumer.sendRequest(
    source, // source
    Location.DONHosted, // location of the secrets
    encodeBytes32String(""),
    ["1695023922", "AD7372"],
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
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
