import { Contract, ethers } from "ethers";

import { abi } from "../out/DelayShield.sol/DelayShield.json";
import { signer } from "./helpers/connection";

const consumerAddress = "0x24721baf57C2d08dB4BF61e289BE5f8992FeebcA"; // TODO @dev get this from step 01

const buyInsurance = async () => {
  // Attach to the FunctionsConsumer contract
  const functionsConsumer = new Contract(consumerAddress, abi, signer);
  // get the request ID by simulating a Tx with a static call
  const requestTx = await functionsConsumer.buyInsurance("AD7372", {
    value: ethers.parseUnits("0.01", "ether"),
    gasPrice: 8000000000,
    gasLimit: 2100000,
  });

  const requestTxReceipt = await requestTx.wait(1);

  console.log(requestTxReceipt);
};

buyInsurance().catch((err: any) => {
  console.log("Error sending the request to Functions Consumer: ", err);
});
