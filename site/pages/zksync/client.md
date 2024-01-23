---
description: Setting up your zkSync Viem Client
---

# Client

To use the zkSync functionality of Viem, you must extend your existing (or new) Viem Client with zkSync Actions.

## Usage

```ts twoslash
import 'viem/window'
// ---cut---
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { zkSync } from 'viem/chains'
import { eip712WalletActions } from 'viem/zksync'
 
const walletClient = createWalletClient({
  chain: zkSync,
  transport: custom(window.ethereum!),
}).extend(eip712WalletActions()) // [!code hl]

const publicClient = createPublicClient({
  chain: zkSync,
  transport: http()
})
```

## Extensions

### `eip712WalletActions`

A suite of [Wallet Actions](/zksync/actions/sendTransaction) for suited for development with zkSync chains.

```ts twoslash
import { eip712WalletActions } from 'viem/zksync'
```

### Sending transactions using paymaster

[Read more](./actions/sendTransaction.md)

```ts
const hash = await walletClient.sendTransaction({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
  paymaster: '0xFD9aE5ebB0F6656f4b77a0E99dCbc5138d54b0BA',
  paymasterInput: '0x123abc...'
})
```

### Calling contracts

[Read more](../docs/contract/writeContract.md)

```ts
import { simulateContract } from 'viem/contract'

const { request } = await publicClient.simulateContract(walletClient, {
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
  functionName: 'mint',
  args: [69420],
}
const hash = await walletClient.writeContract(request)
```
