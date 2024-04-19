---
description: Returns the Chain Id of underlying L1 network.
---

# getL1ChainId

Returns the Chain Id of underlying L1 network.

## Usage

:::code-group

```ts [example.ts]
import { client } from './config'

const chainId = await client.getL1ChainId();
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

### number

L1 Chain Id number

- **Type** `number`