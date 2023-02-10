# encodeBytes

Encodes a string, hex value, number or boolean to a byte array.

## Import

```ts
import { encodeBytes } from 'viem/utils'
```

## Usage

```ts
import { encodeBytes } from 'viem/utils'

encodeBytes('Hello world')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])

encodeBytes('0x48656c6c6f20576f726c6421')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])

encodeBytes(420)
// Uint8Array([1, 164])

encodeBytes(true)
// Uint8Array([1])
```

## Returns

`ByteArray`

The byte array represented as a `Uint8Array`.

## Parameters

### value

- **Type:** `string | Hex`

The value to encode as bytes.

## Shortcut Functions

### hexToBytes

- **Type:** `Hex`

Encodes a hex value to a byte array.

```ts
import { numberToHex } from 'viem/utils'

hexToBytes('0x48656c6c6f20576f726c6421') // [!code focus:2]
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

### stringToBytes

- **Type:** `Hex`

Encodes a string to a byte array.

```ts
import { numberToHex } from 'viem/utils'

stringToBytes('Hello world') // [!code focus:2]
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

### numberToBytes

- **Type:** `number | bigint`

Encodes a number to a byte array.

```ts
import { numberToHex } from 'viem/utils'

numberToBytes(420) // [!code focus:2]
// Uint8Array([1, 164])
```

### boolToBytes

- **Type:** `boolean`

Encodes a boolean to a byte array.

```ts
import { numberToHex } from 'viem/utils'

numberToBytes(true) // [!code focus:2]
// Uint8Array([1])
```
