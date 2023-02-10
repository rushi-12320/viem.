# setCode

Modifies the bytecode stored at an account's address.

## Import 

```ts
import { setCode } from 'viem/test'
```

## Usage

```ts
import { setCode } from 'viem/test'
import { testClient } from '.'
 
await setCode(testClient, { // [!code focus:4]
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
  bytecode: '0x60806040526000600355600019600955600c80546001600160a01b031916737a250d5630b4cf539739df...'
})
```

## Parameters

### address

- **Type:** `Address`

The account address.

```ts
await setCode(testClient, {
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79', // [!code focus]
  bytecode: '0x60806040526000600355600019600955600c80546001600160a01b031916737a250d5630b4cf539739df...'
})
```

### bytecode

- **Type:** `Address`

The stored bytecode.

```ts
await setCode(testClient, {
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
  bytecode: '0x60806040526000600355600019600955600c80546001600160a01b031916737a250d5630b4cf539739df...' // [!code focus]
})
```