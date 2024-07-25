# Turbin3 Cohort Assignments

This repository contains two separate assignments: one developed using Rust and the other using TypeScript. Both projects are designed to interact with the Solana blockchain, performing tasks such as key generation, token airdrops, and executing transactions on the devnet.

## Structure

```
.
├── rust-assignment
│   ├── Cargo.toml # Rust project manifest
│   ├── Cargo.lock # Lock file for Rust dependencies
│   └── src
│       ├── lib.rs # Main library source file for Rust
│       └── programs
│           ├── mod.rs # Module declarations for Rust programs
│           └── wba_prereq.rs # Rust source file for WBA prerequisites
└── typescript-assignment
    ├── package.json # Project manifest for Node.js
    ├── tsconfig.json # TypeScript configuration file
    ├── yarn.lock # Yarn lock file for Node.js dependencies
    ├── airdrop.ts # Script for airdropping tokens
    ├── enroll.ts # Script for enrollment
    ├── keygen.ts # Script for key generation
    ├── transfer.ts # Script for transferring tokens
    ├── verify.ts # Script for verifying transaction
    └── programs
        └── wba_prereq.ts # TypeScript source file for WBA prerequisites
```

## Rust Assignment

### Prerequisites

-   Install Rust and Cargo from [rust-lang.org](https://www.rust-lang.org/tools/install).
-   The project requires the following Rust crates: `solana-sdk`, `solana-client`, `solana-program`.

### Running the Project

1. Navigate to the `rust-assignment` directory.

2. Build the project:

    ```bash
    cargo build
    ```

3. Run tests:
    ```bash
    cargo test -- --nocapture
    ```

## TypeScript Assignment

### Prerequisites

-   Ensure Node.js and Yarn are installed.
-   Install dependencies via Yarn:
    ```bash
    yarn install
    ```

### Running the Project

1. Navigate to the `typescript-assignment` directory.

2. Run the scripts using ts-node. For example:
    ```bash
    ts-node enroll.ts
    ```


