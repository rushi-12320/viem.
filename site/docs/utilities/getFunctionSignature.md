# getFunctionSignature

Returns the function signature (4 byte encoding) for a given function definition.

## Install

```ts
import { getFunctionSignature } from 'viem/utils'
```

## Usage

```ts
import { getFunctionSignature } from 'viem/utils'

const signature = getFunctionSignature('function ownerOf(uint256 tokenId)')
// 0x6352211e

const signature = getFunctionSignature('ownerOf(uint256)')
// 0x6352211e
```

## Returns

`Hex`

The signature as a hex value.

## Parameters

### function

- **Type:** `string`

The function to generate a signature for.

