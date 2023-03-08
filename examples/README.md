# Examples

The `examples/` directory is a growing & living folder, and open for contributions.

Each example has it's own isolated [StackBlitz](https://new.viem.sh) project, so folks can easily play around with the example.

The below list is not exhaustive, and is a work in progress. If you have an idea for an example that is not listed below, please open a [discussion thread](https://github.com/wagmi-dev/viem/discussions/new?category=feature-request&title=Example%20Request:) proposing your idea. If you wish to take on an example that is not completed, go ahead!

- Blocks
  - [x] Fetching Blocks
  - [x] Watching Blocks
- Clients
  - [x] Public (w/ HTTP, WebSocket, Fallback)
  - [x] Wallet – JSON-RPC Account (`window.ethereum`)
  - [ ] Wallet - JSON-RPC Account (WalletConnect v2)
  - [ ] Wallet – Local Account (ethers-rs + WASM)
  - [ ] Test (Anvil)
  - [ ] Test (Hardhat)
- Contracts
  - [x] Deploying
  - [x] Reading
  - [x] Writing
  - [ ] Multicall
  - [ ] Call
  - [ ] Events
  - [ ] Simulating Method Calls
- ENS
  - [x] Address from ENS Name
  - [x] ENS Name from Address
  - [ ] Fetch ENS Resolver
- Filters & Logs
  - [ ] Blocks
  - [ ] Pending Transactions
  - [x] Events
- Anvil/Hardhat
  - [ ] Impersonating Accounts
  - [ ] Setting Balances
  - [ ] Mining (mine, automining, interval mining, etc)
  - [ ] Resetting Forks
  - [ ] State (snapshot/revert)
  - [ ] Tx pools
- Transactions
  - [x] Fetching Transactions & Receipts
  - [ ] Transaction Types (EIP-1559, Legacy, etc)
  - [ ] Simulating Transactions
  - [x] Sending Transactions (& Waiting for Receipt)
