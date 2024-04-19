---
description: Returns data of transactions in a block.
---

# getRawBlockTransaction

Returns data of transactions in a block.

## Usage

:::code-group

```ts [example.ts]
import { client } from './config'


const rawTx = await client.getRawBlockTransaction({
  number: 1
});
```

```ts [config.ts]
import { createPublicClient, http } from 'viem'
import { zkSyncLocalNode } from 'viem/chains'
import { publicActionsL2 } from 'viem/zksync'

export const client = createPublicClient({
  chain: zkSyncLocalNode,
  transport: http(),
}).extend(publicActionsL2())
```
:::

## Returns 

`RawBlockTransactions`

Data of transactions in a block.

## Parameters

`GetRawBlockTransactionParameters`

### number

Block number.

```ts
const rawTx = await client.getRawBlockTransaction({
  number: 1  // [!code focus]
});
```