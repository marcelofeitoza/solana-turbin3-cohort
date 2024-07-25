mod programs;

#[cfg(test)]
mod tests {
    use crate::programs::wba_prereq::{CompleteArgs, UpdateArgs, WbaPrereqProgram};
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::native_token::LAMPORTS_PER_SOL;
    use solana_sdk::pubkey::Pubkey;
    use solana_sdk::signature::{read_keypair_file, Keypair, Signer};
    use solana_sdk::system_instruction::transfer;
    use solana_sdk::transaction::Transaction;
    use solana_sdk::{self, system_program};
    use std::str::FromStr;

    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!("You've generated a new Solana wallet: {}\n", kp.pubkey());
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
    }

    // #[test]
    // fn airdrop() {
    //     let client = RpcClient::new(RPC_URL);

    //     let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

    //     println!("Requesting airdrop to {:?}", keypair.pubkey());

    //     match client.request_airdrop(&keypair.pubkey(), 2 * LAMPORTS_PER_SOL) {
    //         Ok(s) => {
    //             println!("Success! Check out your TX here:");
    //             println!("https://explorer.solana.com/tx/{}?cluster=devnet", s);
    //         }
    //         Err(e) => println!("Oops, something went wrong: {}", e),
    //     };

    //     println!(
    //         "Balance: {:?}",
    //         client.get_balance(&keypair.pubkey()).unwrap() / LAMPORTS_PER_SOL
    //     );
    // }

    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        let to_pubkey = Pubkey::from_str("i7QHhTWh8rpBqSd7eKTw9jPt9ydzXGcG442jUMoXTmq").unwrap();

        let rpc_client = RpcClient::new(RPC_URL);

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, LAMPORTS_PER_SOL)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "TRANSFER_SOL\nSuccess! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn enroll() {
        let rpc_client = RpcClient::new(RPC_URL);

        let signer = read_keypair_file("wba-wallet.json").expect("Couldn't find wallet file");

        println!(
            "Enrolling student with pubkey: {:?} and balance: {:?} SOL",
            signer.pubkey(),
            rpc_client.get_balance(&signer.pubkey()).unwrap() / LAMPORTS_PER_SOL
        );

        let prereq = WbaPrereqProgram::derive_program_address(&[
            b"prereq",
            signer.pubkey().to_bytes().as_ref(),
        ]);

        let args = CompleteArgs {
            github: b"marcelofeitoza".to_vec(),
        };

        let blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = WbaPrereqProgram::complete(
            &[&signer.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&signer.pubkey()),
            &[&signer],
            blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");
        println!(
            "ENROLL\nSuccess! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }
}
