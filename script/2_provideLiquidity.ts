import { ethers } from "ethers";
import { signer } from "./helpers/connection";

const { CONSUMER_ADDRESS } = process.env;

const sendEther = async () => {
  const tx = await signer.sendTransaction({
    to: CONSUMER_ADDRESS,
    value: ethers.parseUnits("0.02", "ether"),
  });

  console.log("Sending Ether to DelayShield: ", tx);
};

sendEther();
