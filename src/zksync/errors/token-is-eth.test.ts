import { expect, test } from 'vitest'
import { TokenIsEthError } from './token-is-eth.js'

test('TokenIsEthError', () => {
  expect(new TokenIsEthError()).toMatchInlineSnapshot(`
    [TokenIsEthError: Token is an ETH token.

    ETH token cannot be retrived.

    Version: viem@1.0.2]
  `)
})
