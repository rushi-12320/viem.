import { expect, test } from 'vitest'

import { decodeFunctionData } from './decodeFunctionData'

test('foo()', () => {
  expect(
    decodeFunctionData({
      abi: [
        {
          inputs: [],
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0xc2985578',
    }),
  ).toEqual({ args: undefined, functionName: 'foo' })
  expect(
    decodeFunctionData({
      abi: [
        {
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0xc2985578',
    }),
  ).toEqual({ args: undefined, functionName: 'foo' })
})

test('bar(uint256)', () => {
  expect(
    decodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'a',
              type: 'uint256',
            },
          ],
          name: 'bar',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0x0423a1320000000000000000000000000000000000000000000000000000000000000001',
    }),
  ).toEqual({
    args: [1n],
    functionName: 'bar',
  })
})

test('getVoter((uint256,bool,address,uint256))', () => {
  expect(
    decodeFunctionData({
      abi: [
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'weight',
                  type: 'uint256',
                },
                {
                  internalType: 'bool',
                  name: 'voted',
                  type: 'bool',
                },
                {
                  internalType: 'address',
                  name: 'delegate',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'vote',
                  type: 'uint256',
                },
              ],
              internalType: 'struct Ballot.Voter',
              name: 'voter',
              type: 'tuple',
            },
          ],
          name: 'getVoter',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0xf37414670000000000000000000000000000000000000000000000000000000000010f2c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac0000000000000000000000000000000000000000000000000000000000000029',
    }),
  ).toEqual({
    args: [
      {
        delegate: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
        vote: 41n,
        voted: true,
        weight: 69420n,
      },
    ],
    functionName: 'getVoter',
  })
})

test("errors: function doesn't exist", () => {
  expect(() =>
    decodeFunctionData({
      abi: [
        {
          inputs: [],
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0xa37414670000000000000000000000000000000000000000000000000000000000010f2c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac0000000000000000000000000000000000000000000000000000000000000029',
    }),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Encoded function signature \\"0xa3741467\\" not found on ABI.
    Make sure you are using the correct ABI and that the function exists on it.
    You can look up the signature here: https://openchain.xyz/signatures?query=0xa3741467.

    Docs: https://viem.sh/docs/contract/decodeFunctionData
    Version: viem@1.0.2"
  `)
})
