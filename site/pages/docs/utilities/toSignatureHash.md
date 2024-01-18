---
description: Returns the hash (of the function/event signature) for a given event or function definition.
---

# toSignatureHash

Returns the hash (of the function/event signature) for a given event or function definition.

## Install

```ts
import { toSignatureHash } from 'viem'
```

## Usage

```ts twoslash
import { toSignatureHash } from 'viem'

// @log: Output: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
const hash_1 = toSignatureHash('event Transfer(address,address,uint256)')

// @log: Output: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
const hash_2 = toSignatureHash('function ownerOf(uint256)')

// or from an `AbiEvent` on your contract ABI
const selector_3 = toSignatureHash({
  name: 'ownerOf',
  type: 'function',
  inputs: [{ name: 'tokenId', type: 'uint256' }],
  outputs: [],
  stateMutability: 'view',
// @log: Output: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
})
```

## Returns

[`Hex`](/docs/glossary/types#hex)

The hash of the function or event signature.

## Parameters

### event

- **Type:** `string` | [`AbiEvent`](https://abitype.dev/api/types#abievent) | [`AbiFunction`](https://abitype.dev/api/types#abifunction)

The function or event to generate a hash for.
