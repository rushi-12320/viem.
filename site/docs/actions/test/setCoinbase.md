# setCoinbase

Sets the coinbase address to be used in new blocks.

## Usage

```ts
import { testClient } from '.'
 
await testClient.setCoinbase({ // [!code focus:99]
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
})
```

## Parameters

### address

- **Type:** `Address`

The coinbase address.

```ts
await testClient.setCoinbase({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79', // [!code focus]
})
```
