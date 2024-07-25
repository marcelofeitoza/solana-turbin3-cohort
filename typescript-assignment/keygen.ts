import { Keypair } from "@solana/web3.js";

//Generate a new keypair
let kp = Keypair.generate();

console.log(`You've generated a new Solana wallet:
${kp.publicKey.toBase58()}

To save your wallet, copy and paste the following into a JSON file:

[${kp.secretKey}]`);

// save to file with `fs` module
import * as fs from "fs";

async function saveWallet() {
	let wallet = JSON.stringify([kp.secretKey]);
	fs.writeFileSync("dev-wallet.json", wallet);
}

saveWallet();
