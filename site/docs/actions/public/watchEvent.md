# watchEvent

Watches and returns emitted [Event Logs](/docs/glossary/terms#TODO).

This Action will batch up all the Event Logs found within the [`pollingInterval`](#pollinginterval-optional), and invoke them via [`onLogs`](#onLogs).

## Import

```ts
import { watchEvent } from 'viem/public'
```

## Usage

By default, you can watch all broadcasted events to the blockchain by just passing `onLogs`. 

These events will be batched up into [Event Logs](/docs/glossary/terms#TODO) and sent to `onLogs`:

::: code-group

```ts [example.ts]
import { watchEvent } from 'viem/public'
import { publicClient } from './client'
import { wagmiAbi } from './abi'

const unwatch = await watchEvent(publicClient, {
  onLogs: logs => console.log(logs)
})
// > [{ ... }, { ... }, { ... }]
// > [{ ... }, { ... }]
// > [{ ... }, { ... }, { ... }, { ... }]
```

```ts [client.ts]
import { createPublicClient, http } from 'viem/public'
import { mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})
```

:::

## Scoping

You can also scope `watchEvent` to a set of given attributes (listed below).

### Address

`watchEvent` can be scoped to an **address**:

::: code-group

```ts [example.ts]
import { watchEvent } from 'viem/public'
import { publicClient } from './client'
import { wagmiAbi } from './abi'

const unwatch = await watchEvent(publicClient, {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  onLogs: logs => console.log(logs)
})
// > [{ ... }, { ... }, { ... }]
// > [{ ... }, { ... }]
// > [{ ... }, { ... }, { ... }, { ... }]
```

```ts [client.ts]
import { createPublicClient, http } from 'viem/public'
import { mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})
```

:::

### Event

`watchEvent` can be scoped to an **event**:

::: code-group

```ts [example.ts]
import { watchEvent } from 'viem/public'
import { publicClient } from './client'
import { wagmiAbi } from './abi'

const unwatch = await watchEvent(publicClient, {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: 'Transfer(address indexed from, address indexed to, uint256 value)',
  onLogs: logs => console.log(logs)
})
// > [{ ... }, { ... }, { ... }]
// > [{ ... }, { ... }]
// > [{ ... }, { ... }, { ... }, { ... }]
```

```ts [client.ts]
import { createPublicClient, http } from 'viem/public'
import { mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})
```

:::

### Event Arguments

`watchEvnets` can be scoped to given **_indexed_ arguments** on the event:

::: code-group

```ts [example.ts]
import { watchEvent } from 'viem/public'
import { publicClient } from './client'
import { wagmiAbi } from './abi'

const unwatch = await watchEvent(publicClient, {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: 'Transfer(address indexed from, address indexed to, uint256 value)',
  args: {
    from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
  },
  onLogs: logs => console.log(logs)
})
// > [{ ... }, { ... }, { ... }]
// > [{ ... }, { ... }]
// > [{ ... }, { ... }, { ... }, { ... }]
```

```ts [client.ts]
import { createPublicClient, http } from 'viem/public'
import { mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})
```

:::

Only indexed arguments in `event` are candidates for `args`.

These arguments can also be an array to indicate that other values can exist in the position:

```ts
const unwatch = await watchEvent(publicClient, {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: 'Transfer(address indexed from, address indexed to, uint256 value)',
  args: {
    // '0xd8da...' OR '0xa5cc...' OR '0xa152...'
    from: [
      '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 
      '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      '0xa152f8bb749c55e9943a3a0a3111d18ee2b3f94e',
    ],
  }
  onLogs: logs => console.log(logs)
})
```

## Returns

`UnwatchFn`

A function that can be invoked to stop watching for new Event Logs.

## Parameters

### onLogs

- **Type:** `(logs: Log[]) => void`

The new Event Logs.

```ts
const unwatch = watchEvent(
  publicClient,
  { onLogs: logs => console.log(logs) } // [!code focus:1]
)
```

### batch (optional)

- **Type:** `boolean`
- **Default:** `true`

Whether or not to batch the Event Logs between polling intervals.

```ts
const unwatch = watchEvent(
  publicClient,
  { 
    batch: false, // [!code focus]
    onLogs: logs => console.log(logs),
  }
)
```

### onError (optional)

- **Type:** `(error: Error) => void`

Error thrown from listening for new Event Logs.

```ts
const unwatch = watchEvent(
  publicClient,
  { 
    onError: error => console.log(error) // [!code focus:1]
    onLogs: logs => console.log(logs),
  }
)
```

### pollingInterval (optional)

- **Type:** `number`

Polling frequency (in ms). Defaults to the Client's `pollingInterval` config.

```ts
const unwatch = watchEvent(
  client,
  { 
    pollingInterval: 1_000, // [!code focus]
    onLogs: logs => console.log(logs),
  }
)
```