import { expect, test } from 'vitest'

import * as wallet from './wallet'

test('exports wallet actions', () => {
  expect(Object.keys(wallet)).toMatchInlineSnapshot(`
    [
      "addChain",
      "getAddresses",
      "getPermissions",
      "requestAddresses",
      "requestPermissions",
      "sendTransaction",
      "signMessage",
      "switchChain",
      "watchAsset",
    ]
  `)
})
