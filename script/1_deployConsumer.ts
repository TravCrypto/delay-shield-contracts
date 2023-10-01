import { abi, bytecode } from "../out/DelayShield.sol/DelayShield.json";
import { wallet, signer } from "./helpers/connection";
import { ContractFactory, encodeBytes32String } from "ethers";

const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
const donIdBytes32 = encodeBytes32String("fun-ethereum-sepolia-1");

const deployedFunctionsConsumerContract = async () => {
  const contractFactory = new ContractFactory(abi, bytecode, wallet);

  console.log(
    `\nDeploying functions consumer contract on Ethereum Sepolia'...`
  );
  const functionsConsumerContract = await contractFactory
    .connect(signer)
    .deploy(routerAddress, donIdBytes32);

  await functionsConsumerContract.waitForDeployment();
  const contractAddress = await functionsConsumerContract.getAddress();
  console.log(
    `Contract deployed at address, add it as subscriber: ${contractAddress}`
  );
};

deployedFunctionsConsumerContract().catch((err: any) => {
  console.log("\nError deploying Functions Consumer contract: ", err);
});

// 0xf38e8be75e114e7e0d153d5a87c50274a0ea4db2
