import { BorshInstructionCoder } from "@coral-xyz/anchor";
import {
	Connection,
	GetVersionedTransactionConfig,
	Keypair,
	LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { IDL } from "./programs/wba_prereq";
import * as fs from "fs";

const verifyWallets = async (walletPath: string | string[]) => {
	const connection = new Connection("https://api.devnet.solana.com");

	if (Array.isArray(walletPath)) {
		walletPath.forEach(async (path) => {
			const wallet = JSON.parse(fs.readFileSync(path, "utf8"));
			const secretKey = new Uint8Array(Object.values(wallet[0]));

			const keypair = Keypair.fromSecretKey(secretKey);

			console.log(
				`Public key: ${keypair.publicKey.toBase58()}
Private key: ${keypair.secretKey}
Balance: ${(await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL}
File: ${path}\n`
			);
		});
	} else {
		const wallet = JSON.parse(fs.readFileSync(walletPath, "utf8"));
		const secretKey = new Uint8Array(Object.values(wallet[0]));

		const keypair = Keypair.fromSecretKey(secretKey);

		console.log(
			`Public key: ${keypair.publicKey.toBase58()}
Private key: ${keypair.secretKey}
Balance: ${(await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL}
File: ${walletPath}\n`
		);
	}
};

const verifyTx1 = async (txSignature: string) => {
	const connection = new Connection("https://api.devnet.solana.com");
	const tx = await connection.getTransaction(txSignature);

	console.log(
		`URL: https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
	);

	if (tx) {
		// Verify the program ID called is the WBA program id
		// WBA program ID: WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq
		console.log("Program IDs:");
		tx.transaction.message
			.programIds()
			.forEach((id) => console.log(id.toString()));

		const ixs = tx.transaction.message.instructions;
		const coder = new BorshInstructionCoder(IDL);

		ixs.forEach((ix) => {
			const msg = coder.decode(ix.data, "base58");
			console.log("instruction name: ", msg?.name);

			const ixData = msg?.data;
			// @ts-ignore
			// Typescript hack since it doesn't know that the `github` args exists in the
			// params to the `complete` instruction
			const githubBuffer = ixData?.github as Buffer;
			console.log("github username: ", githubBuffer.toString("utf8"));
		});
	}

	console.log("\n");
};

async function verifyTx2(txSignature: string) {}

(async () => {
	await Promise.all([
		await verifyTx1(
			"48HsysqwznhoduHatB3GpBHgPFYyEzDWF4wMoBPJsURhmysrbhmcYXjirhRi8YvP6dYVnipBMuyvHZTXK3sGAm8j"
		),
		await verifyTx2(
			"22hFfuF3gb3MaQ1Y7J5ky6tX99LWpuYExtjAtWM7BG2ANRxN8r9X73KSqcR5YCWtud7XyabRyJD8Hq5HZ3rF85ZU"
		),
		await verifyWallets(["dev-wallet.json", "wba-wallet.json"]),
	]);
})();
