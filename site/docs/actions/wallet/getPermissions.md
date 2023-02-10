# getPermissions

Gets the wallets current permissions.

## Usage

```ts
import { getPermissions } from 'viem/wallet'
```

## Usage

```ts
import { getPermissions } from 'viem/wallet'
import { walletClient } from '.'
 
const permissions = await getPermissions(walletClient) // [!code focus:99]
```

## Returns

[`WalletPermission[]`](/docs/glossary/types#TODO)

The wallet permissions.

