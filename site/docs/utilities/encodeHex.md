# encodeHex

Encodes a string, number, boolean or byte array to a hex value value.

## Import

```ts
import { encodeHex } from 'viem/utils'
```

## Usage

```ts
import { encodeHex } from 'viem/utils'

encodeHex(420)
// "0x1a4"

encodeHex('Hello world')
// "0x48656c6c6f20776f726c642e"

encodeHex(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
)
// "0x48656c6c6f20576f726c6421"

encodeHex(true)
// "0x1"
```

## Returns

`Hex`

The hex value.

## Parameters

### Value

- **Type:** `string | number | bigint | ByteArray`

The value to hex encode.

## Shortcut Functions

### numberToHex

- **Type:** `number | bigint`

Encodes a number value to a hex value.

```ts
import { numberToHex } from 'viem/utils'

numberToHex(420)
// "0x1a4"

numberToHex(4206942069420694206942069420694206942069n)
// "0xc5cf39211876fb5e5884327fa56fc0b75"
```

### stringToHex

- **Type:** `string`

Encodes a UTF-8 string value to a hex value.

```ts
import { stringToHex } from 'viem/utils'

stringToHex('Hello World!')
// "0x48656c6c6f20576f726c6421"
```

### bytesToHex

- **Type:** `ByteArray`

Encodes a byte array to a hex value.

```ts
import { stringToHex } from 'viem/utils'

bytesToHex(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
)
// "0x48656c6c6f20576f726c6421"
```

### boolToHex

- **Type:** `boolean`

Encodes a boolean to a hex value.

```ts
import { stringToHex } from 'viem/utils'

bytesToHex(true)
// "0x1"
```