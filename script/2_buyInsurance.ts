import { Contract, ethers } from "ethers";

import { abi } from "../out/DelayShield.sol/DelayShield.json";
import { signer } from "./helpers/connection";

const consumerAddress = "0xc8e5398cF3DCE36bEA91035658ED3C4bb03BC090"; // TODO @dev get this from step 01

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
