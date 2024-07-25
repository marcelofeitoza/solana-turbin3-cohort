import {
	Transaction,
	SystemProgram,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	sendAndConfirmTransaction,
	PublicKey,
} from "@solana/web3.js";

import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(Object.values(wallet[0])));

// Define our WBA public key
const to = new PublicKey("i7QHhTWh8rpBqSd7eKTw9jPt9ydzXGcG442jUMoXTmq");

//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
	try {
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: from.publicKey,
				toPubkey: to,
				lamports: LAMPORTS_PER_SOL / 100,
			})
		);
		transaction.recentBlockhash = (
			await connection.getLatestBlockhash("confirmed")
		).blockhash;
		transaction.feePayer = from.publicKey;

		// Sign transaction, broadcast, and confirm
		const signature = await sendAndConfirmTransaction(
			connection,
			transaction,
			[from]
		);
		console.log(
			`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
		);
	} catch (e) {
		console.error(`Oops, something went wrong: ${e}`);
	}
})();

(async () => {
	try {
		// Get balance of dev wallet
		const balance = await connection.getBalance(from.publicKey);
		console.log(`Balance: ${balance}`);

		console.log(
			`From: ${from.publicKey.toBase58()} | ${
				balance / LAMPORTS_PER_SOL
			} SOL`
		);
		console.log(
			`To: ${to.toBase58()} | ${
				(await connection.getBalance(to)) / LAMPORTS_PER_SOL
			} SOL`
		);

		// Create a test transaction to calculate fees
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: from.publicKey,
				toPubkey: to,
				lamports: balance,
			})
		);
		transaction.recentBlockhash = (
			await connection.getLatestBlockhash("confirmed")
		).blockhash;
		transaction.feePayer = from.publicKey;

		// Calculate exact fee rate to transfer entire SOL amount out of account minus fees
		const fee =
			(
				await connection.getFeeForMessage(
					transaction.compileMessage(),
					"confirmed"
				)
			).value || 0;
		console.log(`Fee: ${fee}`);

		// Remove our transfer instruction to replace it
		transaction.instructions.pop();

		// Now add the instruction back with correct amount of lamports
		const lamportsToTransfer = balance - fee;
		console.log(`Lamports to transfer: ${lamportsToTransfer}`);
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: from.publicKey,
				toPubkey: to,
				lamports: lamportsToTransfer,
			})
		);

		// Sign transaction, broadcast, and confirm
		const signature = await sendAndConfirmTransaction(
			connection,
			transaction,
			[from]
		);
		console.log(
			`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
		);
	} catch (e: any) {
		console.error(`Oops, something went wrong: ${JSON.stringify(e)}`);
		console.error(`Error details: ${e.message}`);
	}
})();
