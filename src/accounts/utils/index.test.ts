import { expect, test } from 'vitest'

import * as utils from './index'

test('exports utils', () => {
  expect(Object.keys(utils)).toMatchInlineSnapshot(`
    [
      "parseAccount",
      "publicKeyToAddress",
      "signMessage",
      "signatureToHex",
      "signTransaction",
      "signTypedData",
    ]
  `)
})
