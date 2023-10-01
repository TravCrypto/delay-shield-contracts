import { ethers } from "ethers";
import { signer } from "./helpers/connection";

const sendEther = async () => {
  const tx = await signer.sendTransaction({
    to: "0x24721baf57C2d08dB4BF61e289BE5f8992FeebcA",
    value: ethers.parseUnits("0.02", "ether"),
  });

  console.log("Sending Ether to DelayShield: ", tx);
};

sendEther();
