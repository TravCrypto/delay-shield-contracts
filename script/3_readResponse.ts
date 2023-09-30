import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";

import { signer } from "./helpers/connection";
import { abi } from "../out/DelayShield.sol/DelayShield.json";

const consumerAddress = "0xf38e8be75e114e7e0d153d5a87c50274a0ea4db2"; // TODO @dev get this from step 01

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

//0x7b22666c69676874436f6465223a22494233303039222c2264656c61794f6e4172726976616c223a322c22737461747573223a226c616e646564227d
