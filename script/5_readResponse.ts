import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";

import { signer } from "./helpers/connection";
import { abi } from "../out/DelayShield.sol/DelayShield.json";

const consumerAddress = "0xc8e5398cF3DCE36bEA91035658ED3C4bb03BC090"; // TODO @dev get this from step 01

const readResponse = async () => {
  if (!consumerAddress) {
    throw new Error(
      "Please set the consumerAddress variable in scripts/03_encryptAndUploadSecrets.ts"
    );
  }

  const functionsConsumer = new Contract(consumerAddress, abi, signer);

  const responseHex = await functionsConsumer.s_lastResponse();
  const responseDataType = ReturnType.string;
  const responseDecoded = decodeResult(responseHex, responseDataType);

  console.table({
    "Response Hex": responseHex,
    "Response Decoded": responseDecoded.toString(),
  });
};

readResponse().catch((err: any) => {
  console.log("Error reading response: ", err);
});
