import { describe, expect, test } from 'vitest'
import { signTypedData } from '../wallet'
import { accounts } from '../_test'
import { getAccount } from './account'

describe('account', () => {
  test('json-rpc account', () => {
    expect(getAccount(accounts[0].address)).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "type": "json-rpc",
      }
    `)
  })

  test('json-rpc account (invalid address)', () => {
    expect(() => getAccount('0x1')).toThrowErrorMatchingInlineSnapshot(`
      "Address \\"0x1\\" is invalid.

      Version: viem@1.0.2"
    `)
  })

  test('local account', () => {
    expect(
      getAccount({
        address: accounts[0].address,
        async signMessage() {
          return '0x'
        },
        async signTransaction() {
          return '0x'
        },
        async signTypedData() {
          return '0x'
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "signMessage": [Function],
        "signTransaction": [Function],
        "type": "local",
      }
    `)
  })

  test('local account (invalid address)', () => {
    expect(() =>
      getAccount({
        address: '0x1',
        async signMessage() {
          return '0x'
        },
        async signTransaction() {
          return '0x'
        },
        async signTypedData() {
          return '0x'
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Address \\"0x1\\" is invalid.

      Version: viem@1.0.2"
    `)
  })
})
