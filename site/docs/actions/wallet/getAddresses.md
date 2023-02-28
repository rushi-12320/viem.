---
head:
  - - meta
    - property: og:title
      content: getAddresses
  - - meta
    - name: description
      content: Returns a list of addresses owned by the wallet or client.
  - - meta
    - property: og:description
      content: Returns a list of addresses owned by the wallet or client.

---

# getAddresses

Returns a list of account addresses owned by the wallet or client.

## Usage

```ts
import { walletClient } from '.'
 
const accounts = await walletClient.getAddresses() // [!code focus:99]
// ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC']
```

## Returns

`'0x${string}'[]`

A list of checksummed addresses.


