require("dotenv").config();

import { JsonRpcProvider, Wallet } from "ethers";

const { RPC_URL, PRIVATE_KEY } = process.env;

const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY || "UNSET");
const signer = wallet.connect(provider);

export { provider, wallet, signer };
