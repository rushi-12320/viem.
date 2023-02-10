# setIntervalMining

Sets the automatic mining interval (in seconds) of blocks. Setting the interval to `0` will disable automatic mining.

## Import 

```ts
import { setIntervalMining } from 'viem/test'
```

## Usage

```ts
import { setIntervalMining } from 'viem/test'
import { testClient } from '.'
 
await setIntervalMining(testClient, { // [!code focus:4]
  interval: 5
})
```

## Parameters

### interval

- **Type:** `number`

The mining interval (in seconds). Setting the interval to `0` will disable automatic mining.

```ts
await setIntervalMining(testClient, {
  interval: 5 // [!code focus]
})
```