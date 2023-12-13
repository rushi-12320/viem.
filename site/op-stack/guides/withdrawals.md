---
head:
  - - meta
    - property: og:title
      content: Withdrawals
  - - meta
    - name: description
      content: How to withdraw from OP Stack chains to Mainnet.
  - - meta
    - property: og:description
      content: How to withdraw from OP Stack chains to Mainnet.

---

# Withdrawals

This guide will demonstrate how to withdraw **1 Ether** from **[Optimism (OP Mainnet)](https://www.optimism.io/)** to **Mainnet**.

## Overview

Here is an end-to-end overview of how to execute a withdrawal. We will break it down into [Steps](#steps) below.

::: code-group

```ts [deposit.ts]
import { getWithdrawalMessages } from 'viem/op-stack'
import { 
  account, 
  publicClientL1, 
  walletClientL1,
  publicClientL2, 
  walletClientL2 
} from './config'

// Build parameters to initiate the withdrawal transaction on the L1.
const request = await publicClientL1.buildInitiateWithdrawal({
  to: account.address,
  value: parseEther('1')
})
 
// Execute the initiate withdrawal transaction on the L2.
const hash = await walletClientL2.initiateWithdrawal(request)

// Wait for the initiate withdrawal transaction receipt.
const receipt = await publicClientL2.waitForTransactionReceipt({ hash })

// Wait until the withdrawal is ready to prove
const { message, output } = await publicClientL1.waitToProve({
  receipt,
  targetChain: walletClientL2.chain
})

// Build parameters to prove the withdrawal on the L2.
const proveRequest = await publicClientL2.buildProveWithdrawal({
  message,
  output,
})

// Prove the withdrawal on the L1
const proveHash = await walletClientL1.proveWithdrawal(proveRequest)
```

```ts [config.ts (JSON-RPC Account)]
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet, optimism } from 'viem/chains'
import { publicActionsL1, walletActionsL1, walletActionsL2 } from 'viem/op-stack'

// Retrieve Account from an EIP-1193 Provider. 
export const [account] = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
}) 

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: optimism,
  transport: http()
})

export const walletClientL2 = createWalletClient({
  account,
  chain: optimism,
  transport: custom(window.ethereum)
}).extend(walletActionsL2())
```

```ts [config.ts (Local Account)]
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet, optimism } from 'viem/chains'
import { publicActionsL1, walletActionsL1, walletActionsL2 } from 'viem/op-stack'

export const account = privateKeyToAccount('0x...')

export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())

export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())

export const publicClientL2 = createPublicClient({
  chain: optimism,
  transport: http()
})

export const walletClientL2 = createWalletClient({
  account,
  chain: optimism,
  transport: http()
}).extend(walletActionsL2())
```

:::