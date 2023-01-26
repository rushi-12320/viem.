import { describe, expect, test } from 'vitest'

import {
  AbiEncodingArrayLengthMismatchError,
  AbiEncodingLengthMismatchError,
  InvalidAbiEncodingTypeError,
  InvalidArrayError,
  encodeAbi,
  getArrayComponents,
} from './encodeAbi'

describe('static', () => {
  test('blank', () => {
    expect(
      encodeAbi({
        params: [],
        values: [],
      }),
    ).toBe(undefined)
  })

  test('uint', () => {
    expect(
      encodeAbi({
        params: [
          {
            internalType: 'uint256',
            name: 'xIn',
            type: 'uint256',
          },
        ],
        values: [69420n],
      }),
    ).toBe('0x0000000000000000000000000000000000000000000000000000000000010f2c')
  })

  describe('uint8', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint8',
              name: 'xIn',
              type: 'uint8',
            },
          ],
          values: [32],
        }),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000020',
      )
    })

    test('invalid value', () => {
      try {
        encodeAbi({
          params: [
            {
              internalType: 'uint8',
              name: 'xIn',
              type: 'uint8',
            },
          ],
          // @ts-expect-error
          values: [69420n],
        })
        encodeAbi({
          params: [
            {
              internalType: 'uint8',
              name: 'xIn',
              type: 'uint8',
            },
          ],
          // @ts-expect-error
          values: ['lol'],
        })
      } catch {}
    })
  })

  describe('uint32', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint32',
              name: 'xIn',
              type: 'uint32',
            },
          ],
          values: [69420],
        }),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000010f2c',
      )
    })

    test('invalid value', () => {
      try {
        encodeAbi({
          params: [
            {
              internalType: 'uint32',
              name: 'xIn',
              type: 'uint32',
            },
          ],
          // @ts-expect-error
          values: [69420n],
        })
        encodeAbi({
          params: [
            {
              internalType: 'uint32',
              name: 'xIn',
              type: 'uint32',
            },
          ],
          // @ts-expect-error
          values: ['lol'],
        })
      } catch {}
    })
  })

  describe('int', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int256',
              name: 'xIn',
              type: 'int256',
            },
          ],
          values: [69420n],
        }),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000010f2c',
      )
    })

    test('negative (twos compliment)', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int256',
              name: 'xIn',
              type: 'int256',
            },
          ],
          values: [-69420n],
        }),
      ).toBe(
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffef0d4',
      )
    })
  })

  describe('int8', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int8',
              name: 'xIn',
              type: 'int8',
            },
          ],
          values: [127],
        }),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000000007f',
      )
    })

    test('negative (twos compliment)', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int8',
              name: 'xIn',
              type: 'int8',
            },
          ],
          values: [-128],
        }),
      ).toBe(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff80',
      )
    })

    test('invalid value', () => {
      try {
        encodeAbi({
          params: [
            {
              internalType: 'int8',
              name: 'xIn',
              type: 'int8',
            },
          ],
          // @ts-expect-error
          values: [69420n],
        })
        encodeAbi({
          params: [
            {
              internalType: 'int8',
              name: 'xIn',
              type: 'int8',
            },
          ],
          // @ts-expect-error
          values: ['lol'],
        })
      } catch {}
    })
  })

  describe('int32', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int32',
              name: 'xIn',
              type: 'int32',
            },
          ],
          values: [2147483647],
        }),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000007fffffff',
      )
    })

    test('negative (twos compliment)', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int8',
              name: 'xIn',
              type: 'int8',
            },
          ],
          values: [-2147483648],
        }),
      ).toBe(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff80000000',
      )
    })

    test('invalid value', () => {
      try {
        encodeAbi({
          params: [
            {
              internalType: 'int32',
              name: 'xIn',
              type: 'int32',
            },
          ],
          // @ts-expect-error
          values: [69420n],
        })
        encodeAbi({
          params: [
            {
              internalType: 'int32',
              name: 'xIn',
              type: 'int32',
            },
          ],
          // @ts-expect-error
          values: ['lol'],
        })
      } catch {}
    })
  })

  describe('address', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'address',
              name: 'xIn',
              type: 'address',
            },
          ],
          values: ['0x14dC79964da2C08b23698B3D3cc7Ca32193d9955'],
        }),
      ).toBe(
        '0x00000000000000000000000014dc79964da2c08b23698b3d3cc7ca32193d9955',
      )
    })
  })

  describe('bool', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'bool',
              name: 'xIn',
              type: 'bool',
            },
          ],
          values: [true],
        }),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      )
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'bool',
              name: 'xIn',
              type: 'bool',
            },
          ],
          values: [false],
        }),
      ).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      )
    })
  })

  describe('bytes8', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'bytes8',
              name: 'xIn',
              type: 'bytes8',
            },
          ],
          values: ['0x0123456789abcdef'],
        }),
      ).toBe(
        '0x0123456789abcdef000000000000000000000000000000000000000000000000',
      )
    })

    test('overflow', () => {
      expect(() =>
        encodeAbi({
          params: [
            {
              internalType: 'bytes8',
              name: 'xIn',
              type: 'bytes8',
            },
          ],
          values: [
            '0x0000000000000000000000000000000000000000000000000000000000000000000000000123456789abcdef',
          ],
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Hex size (44) exceeds padding size (32).

        Version: viem@1.0.2"
      `)
    })
  })

  describe('bytes16', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'bytes16',
              name: 'xIn',
              type: 'bytes16',
            },
          ],
          values: ['0x4206942069420'],
        }),
      ).toBe(
        '0x4206942069420000000000000000000000000000000000000000000000000000',
      )
    })

    test('overflow', () => {
      expect(() =>
        encodeAbi({
          params: [
            {
              internalType: 'bytes16',
              name: 'xIn',
              type: 'bytes16',
            },
          ],
          values: [
            '0x00000000000000000000000000000000000000000000000000000000000000420',
          ],
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Hex size (33) exceeds padding size (32).

        Version: viem@1.0.2"
      `)
    })
  })

  describe('uint[3]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint256[3]',
              name: 'xIn',
              type: 'uint256[3]',
            },
          ],
          values: [[69420n, 42069n, 420420420n]],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000010f2c000000000000000000000000000000000000000000000000000000000000a45500000000000000000000000000000000000000000000000000000000190f1b44"',
      )
    })
  })

  describe('int[3]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'int256[3]',
              name: 'xIn',
              type: 'int256[3]',
            },
          ],
          values: [[69420n, -42069n, 420420420n]],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000010f2cffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5bab00000000000000000000000000000000000000000000000000000000190f1b44"',
      )
    })
  })

  describe('address[2]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'address[2]',
              name: 'xIn',
              type: 'address[2]',
            },
          ],
          values: [
            [
              '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b',
              '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            ],
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000c961145a54c96e3ae9baa048c4f4d6b04c13916b000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac"',
      )
    })
  })

  describe('bool[2]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'bool[2]',
              name: 'xIn',
              type: 'bool[2]',
            },
          ],
          values: [[true, false]],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('bytes8[2]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'bytes8[2]',
              name: 'xIn',
              type: 'bytes8[2]',
            },
          ],
          values: [['0x123', '0x111']],
        }),
      ).toMatchInlineSnapshot(
        '"0x12300000000000000000000000000000000000000000000000000000000000001110000000000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('uint[3][2]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint256[3][2]',
              name: 'xIn',
              type: 'uint256[3][2]',
            },
          ],
          values: [
            [
              [69420n, 42069n, 420420420n],
              [420n, 44n, 422n],
            ],
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000010f2c000000000000000000000000000000000000000000000000000000000000a45500000000000000000000000000000000000000000000000000000000190f1b4400000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000001a6"',
      )
    })
  })

  describe('uint[3][2][4]', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint256[3][2][4]',
              name: 'xIn',
              type: 'uint256[3][2][4]',
            },
          ],
          values: [
            [
              [
                [1n, 2n, 3n],
                [4n, 5n, 6n],
              ],
              [
                [7n, 8n, 9n],
                [10n, 11n, 12n],
              ],
              [
                [13n, 14n, 15n],
                [16n, 17n, 18n],
              ],
              [
                [19n, 20n, 21n],
                [22n, 23n, 24n],
              ],
            ],
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000015000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000018"',
      )
    })
  })

  describe('struct: (uint256,bool,address)', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a((uint256,bool,address))" "(420,true,0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC)"
        encodeAbi({
          params: [
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256',
                },
                {
                  internalType: 'bool',
                  name: 'y',
                  type: 'bool',
                },
                {
                  internalType: 'address',
                  name: 'z',
                  type: 'address',
                },
              ],
              internalType: 'struct ABIExample.Foo',
              name: 'fooIn',
              type: 'tuple',
            },
          ],
          values: [
            {
              x: 420n,
              y: true,
              z: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            },
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac"',
      )
    })
  })

  describe('struct: (uint256,bool,address)', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a((uint256,bool,address))" "(420,true,0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC)"
        encodeAbi({
          params: [
            {
              components: [
                {
                  internalType: 'uint256',
                  type: 'uint256',
                },
                {
                  internalType: 'bool',
                  type: 'bool',
                },
                {
                  internalType: 'address',
                  type: 'address',
                },
              ],
              internalType: 'struct ABIExample.Foo',
              name: 'fooOut',
              type: 'tuple',
            },
          ],
          values: [[420n, true, '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC']],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac"',
      )
    })
  })

  describe('struct: ((uint256,bool,address),(uint256,bool,address),uint8[2])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(((uint256,bool,address),(uint256,bool,address),uint8[2]))" "((420,true,0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC),(69,false,0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b),[1,2])"
        encodeAbi({
          params: [
            {
              components: [
                {
                  components: [
                    {
                      internalType: 'uint256',
                      name: 'x',
                      type: 'uint256',
                    },
                    {
                      internalType: 'bool',
                      name: 'y',
                      type: 'bool',
                    },
                    {
                      internalType: 'address',
                      name: 'z',
                      type: 'address',
                    },
                  ],
                  internalType: 'struct ABIExample.Foo',
                  name: 'foo',
                  type: 'tuple',
                },
                {
                  components: [
                    {
                      internalType: 'uint256',
                      name: 'x',
                      type: 'uint256',
                    },
                    {
                      internalType: 'bool',
                      name: 'y',
                      type: 'bool',
                    },
                    {
                      internalType: 'address',
                      name: 'z',
                      type: 'address',
                    },
                  ],
                  internalType: 'struct ABIExample.Foo',
                  name: 'baz',
                  type: 'tuple',
                },
                {
                  internalType: 'uint8[2]',
                  name: 'x',
                  type: 'uint8[2]',
                },
              ],
              internalType: 'struct ABIExample.Bar',
              name: 'barIn',
              type: 'tuple',
            },
          ],
          values: [
            {
              foo: {
                x: 420n,
                y: true,
                z: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
              },
              baz: {
                x: 69n,
                y: false,
                z: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b',
              },
              x: [1, 2],
            },
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac00000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c961145a54c96e3ae9baa048c4f4d6b04c13916b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002"',
      )
    })
  })

  describe('(uint256[2],bool,string[])', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            { internalType: 'uint256[2]', name: 'xOut', type: 'uint256[2]' },
            { internalType: 'bool', name: 'yOut', type: 'bool' },
            { internalType: 'string[3]', name: 'zOut', type: 'string[3]' },
          ] as any,
          values: [[420n, 69n], true, ['wagmi', 'viem', 'lol']],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000004500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000057761676d6900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047669656d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036c6f6c0000000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('multiple params: (uint,bool,address)', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint256',
              name: 'xIn',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: 'yIn',
              type: 'bool',
            },
            {
              internalType: 'address',
              name: 'zIn',
              type: 'address',
            },
          ],
          values: [420n, true, '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b'],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c961145a54c96e3ae9baa048c4f4d6b04c13916b"',
      )
    })
  })

  describe('multiple params unnamed: (uint,bool,address)', () => {
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          values: [420n, true, '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b'],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c961145a54c96e3ae9baa048c4f4d6b04c13916b"',
      )
    })
  })
})

describe('dynamic', () => {
  describe('(string)', () => {
    // cast abi-encode "a(string)" "wagmi"
    test('default', () => {
      expect(
        encodeAbi({
          params: [
            {
              internalType: 'string',
              name: 'xOut',
              type: 'string',
            },
          ],
          values: ['wagmi'],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(string,uint,bool)', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(string,uint,bool)" "wagmi" 420 true
        encodeAbi({
          params: [
            {
              internalType: 'string',
              name: 'xIn',
              type: 'string',
            },
            {
              internalType: 'uint256',
              name: 'yIn',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: 'zIn',
              type: 'bool',
            },
          ],
          values: ['wagmi', 420n, true],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(uint[2],bool,string)', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(uint[2],bool,string)" "[420,69]" true "wagmi"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[2]',
              name: 'xIn',
              type: 'uint256[2]',
            },
            {
              internalType: 'bool',
              name: 'yIn',
              type: 'bool',
            },
            {
              internalType: 'string',
              name: 'zIn',
              type: 'string',
            },
          ] as const,
          values: [[420n, 69n], true, 'wagmi'],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000001a400000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(bytes)', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(bytes)" "0x042069"
        encodeAbi({
          params: [
            {
              internalType: 'bytes',
              name: 'xIn',
              type: 'bytes',
            },
          ],
          values: ['0x042069'],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030420690000000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(uint[])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(uint[])" "[420,69,22,55]"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[]',
              name: 'xIn',
              type: 'uint256[]',
            },
          ],
          values: [[420n, 69n, 22n, 55n]],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000004500000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000037"',
      )
    })

    test('empty', () => {
      expect(
        // cast abi-encode "a(uint[])" "[]"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[]',
              name: 'xIn',
              type: 'uint256[]',
            },
          ],
          values: [[]],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(uint[][])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(uint[][])" "[[420,69]]"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[][]',
              name: 'xIn',
              type: 'uint256[][]',
            },
          ],
          values: [[[420n, 69n]]],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000045"',
      )
    })

    test('empty', () => {
      expect(
        // cast abi-encode "a(uint[][])" "[[]]"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[][]',
              name: 'xIn',
              type: 'uint256[][]',
            },
          ],
          values: [[[]]],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000"',
      )
    })

    test('complex', () => {
      expect(
        // cast abi-encode "a(uint[][])" "[[420,69],[22,55,22],[51,52,66,11]]"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[][]',
              name: 'xIn',
              type: 'uint256[][]',
            },
          ],
          values: [
            [
              [420n, 69n],
              [22n, 55n, 22n],
              [51n, 52n, 66n, 11n],
            ],
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000004500000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000003700000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003300000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000000b"',
      )
    })
  })

  describe('(uint[][][])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(uint[][][])" "[[[420,69]]]"
        encodeAbi({
          params: [
            {
              internalType: 'uint256[][][]',
              name: 'xIn',
              type: 'uint256[][][]',
            },
          ],
          values: [[[[420n, 69n]]]],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000045"',
      )
    })
  })

  describe('(string[2])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(string[2])" "["wagmi","viem"]"
        encodeAbi({
          params: [
            {
              internalType: 'string[2]',
              name: 'xIn',
              type: 'string[2]',
            },
          ],
          values: [['wagmi', 'viem']],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000057761676d6900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047669656d00000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(string[2][3])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(string[2][3])" "[["wagmi","viem"],["jake","tom"],["lol","haha"]]"
        encodeAbi({
          params: [
            {
              internalType: 'string[2][3]',
              name: 'xIn',
              type: 'string[2][3]',
            },
          ],
          values: [
            [
              ['wagmi', 'viem'],
              ['jake', 'tom'],
              ['lol', 'haha'],
            ],
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000057761676d6900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047669656d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000046a616b65000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003746f6d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000036c6f6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046861686100000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('((uint256[],bool,string[]))', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a((uint256[],bool,string[]))" "([1,2,3,4],true,[hello,world])"
        encodeAbi({
          params: [
            {
              components: [
                {
                  internalType: 'uint256[]',
                  name: 'x',
                  type: 'uint256[]',
                },
                {
                  internalType: 'bool',
                  name: 'y',
                  type: 'bool',
                },
                {
                  internalType: 'string[]',
                  name: 'z',
                  type: 'string[]',
                },
              ],
              internalType: 'struct ABIExample.Baz',
              name: 'bazIn',
              type: 'tuple',
            },
          ],
          values: [
            {
              x: [1n, 2n, 3n, 4n],
              y: true,
              z: ['hello', 'world'],
            },
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000568656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005776f726c64000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(((uint256[],bool,string[])),uint256,string[])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a(((uint256[],bool,string[]),uint256,string[]))" "(([1,2,3,4],true,[hello,world]),420,[wagmi,viem])"
        encodeAbi({
          params: [
            {
              components: [
                {
                  components: [
                    {
                      internalType: 'uint256[]',
                      name: 'x',
                      type: 'uint256[]',
                    },
                    {
                      internalType: 'bool',
                      name: 'y',
                      type: 'bool',
                    },
                    {
                      internalType: 'string[]',
                      name: 'z',
                      type: 'string[]',
                    },
                  ],
                  internalType: 'struct ABIExample.Baz',
                  name: 'foo',
                  type: 'tuple',
                },
                {
                  internalType: 'uint256',
                  name: 'a',
                  type: 'uint256',
                },
                {
                  internalType: 'string[]',
                  name: 'b',
                  type: 'string[]',
                },
              ],
              internalType: 'struct ABIExample.Wagmi',
              name: 'wagmiIn',
              type: 'tuple',
            },
          ],
          values: [
            {
              foo: {
                x: [1n, 2n, 3n, 4n],
                y: true,
                z: ['hello', 'world'],
              },
              a: 420n,
              b: ['wagmi', 'viem'],
            },
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000568656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005776f726c6400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000057761676d6900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047669656d00000000000000000000000000000000000000000000000000000000"',
      )
    })
  })

  describe('(((uint256[],bool,string[])),uint256,string[])', () => {
    test('default', () => {
      expect(
        // cast abi-encode "a((uint256[],bool,string[]),(((uint256[],bool,string),uint256,string[]),((uint256[],bool,string),uint256,string[]),uint256,string[]))" "([1,2,3,4],true,[hello, world])" "((([420,69],true,[nice,haha]),420,[wagmi,allday]),(([420,420],true,[this,is,a,param]),69420,[hello,there]),4204202,[lol,haha])"
        encodeAbi({
          params: [
            {
              components: [
                {
                  internalType: 'uint256[]',
                  name: 'x',
                  type: 'uint256[]',
                },
                {
                  internalType: 'bool',
                  name: 'y',
                  type: 'bool',
                },
                {
                  internalType: 'string[]',
                  name: 'z',
                  type: 'string[]',
                },
              ],
              internalType: 'struct ABIExample.Baz',
              name: 'bazIn',
              type: 'tuple',
            },
            {
              components: [
                {
                  components: [
                    {
                      components: [
                        {
                          internalType: 'uint256[]',
                          name: 'x',
                          type: 'uint256[]',
                        },
                        {
                          internalType: 'bool',
                          name: 'y',
                          type: 'bool',
                        },
                        {
                          internalType: 'string[]',
                          name: 'z',
                          type: 'string[]',
                        },
                      ],
                      internalType: 'struct ABIExample.Baz',
                      name: 'foo',
                      type: 'tuple',
                    },
                    {
                      internalType: 'uint256',
                      name: 'a',
                      type: 'uint256',
                    },
                    {
                      internalType: 'string[]',
                      name: 'b',
                      type: 'string[]',
                    },
                  ],
                  internalType: 'struct ABIExample.Wagmi',
                  name: 'foo',
                  type: 'tuple',
                },
                {
                  components: [
                    {
                      components: [
                        {
                          internalType: 'uint256[]',
                          name: 'x',
                          type: 'uint256[]',
                        },
                        {
                          internalType: 'bool',
                          name: 'y',
                          type: 'bool',
                        },
                        {
                          internalType: 'string[]',
                          name: 'z',
                          type: 'string[]',
                        },
                      ],
                      internalType: 'struct ABIExample.Baz',
                      name: 'foo',
                      type: 'tuple',
                    },
                    {
                      internalType: 'uint256',
                      name: 'a',
                      type: 'uint256',
                    },
                    {
                      internalType: 'string[]',
                      name: 'b',
                      type: 'string[]',
                    },
                  ],
                  internalType: 'struct ABIExample.Wagmi',
                  name: 'bar',
                  type: 'tuple',
                },
                {
                  internalType: 'uint256',
                  name: 'c',
                  type: 'uint256',
                },
                {
                  internalType: 'string[]',
                  name: 'd',
                  type: 'string[]',
                },
              ],
              internalType: 'struct ABIExample.Gmi',
              name: 'gmiIn',
              type: 'tuple',
            },
          ],
          values: [
            {
              x: [1n, 2n, 3n, 4n],
              y: true,
              z: ['hello', 'world'],
            },
            {
              foo: {
                a: 420n,
                b: ['wagmi', 'allday'],
                foo: {
                  x: [420n, 69n],
                  y: true,
                  z: ['nice', 'haha'],
                },
              },
              bar: {
                a: 69420n,
                b: ['hello', 'there'],
                foo: {
                  x: [420n, 420n],
                  y: true,
                  z: ['this', 'is', 'a', 'param'],
                },
              },
              c: 4204202n,
              d: ['lol', 'haha'],
            },
          ],
        }),
      ).toMatchInlineSnapshot(
        '"0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000568656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005776f726c640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000004026aa0000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a400000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000004500000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000046e696365000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004686168610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000057761676d690000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006616c6c646179000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000010f2c00000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001a400000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000004746869730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026973000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000161000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005706172616d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000568656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005746865726500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000036c6f6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046861686100000000000000000000000000000000000000000000000000000000"',
      )
    })
  })
})

test('invalid type', () => {
  expect(() =>
    // @ts-expect-error
    encodeAbi({ params: [{ name: 'x', type: 'lol' }], values: [69] }),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Type \\"lol\\" is not a valid encoding type.
    Please provide a valid ABI type.

    Docs: https://viem.sh/docs/contract/encodeAbi#params

    Version: viem@1.0.2"
  `)
})

test('invalid params/values lengths', () => {
  expect(() =>
    encodeAbi({
      params: [{ name: 'x', type: 'uint256[3]' }],
      /* @ts-expect-error */
      values: [69, 420],
    }),
  ).toThrowErrorMatchingInlineSnapshot(`
    "ABI encoding params/values length mismatch.
    Expected length (params): 1
    Given length (values): 2

    Version: viem@1.0.2"
  `)
})

test('invalid array', () => {
  expect(() =>
    /* @ts-expect-error */
    encodeAbi({ params: [{ name: 'x', type: 'uint256[3]' }], values: [69] }),
  ).toThrowErrorMatchingInlineSnapshot(`
    "Value \\"69\\" is not a valid array.

    Version: viem@1.0.2"
  `)
})

test('invalid array lengths', () => {
  expect(() =>
    encodeAbi({
      params: [{ name: 'x', type: 'uint256[3]' }],
      /* @ts-expect-error */
      values: [[69n, 420n]],
    }),
  ).toThrowErrorMatchingInlineSnapshot(`
    "ABI encoding array length mismatch for type uint256[3].
    Expected length: 3
    Given length: 2

    Version: viem@1.0.2"
  `)
})

test('getArrayComponents', () => {
  expect(getArrayComponents('uint256[2]')).toEqual([2, 'uint256'])
  expect(getArrayComponents('uint256[2][3]')).toEqual([3, 'uint256[2]'])
  expect(getArrayComponents('uint256[][3]')).toEqual([3, 'uint256[]'])
  expect(getArrayComponents('uint256[]')).toEqual([null, 'uint256'])
  expect(getArrayComponents('uint256[][]')).toEqual([null, 'uint256[]'])
  expect(getArrayComponents('uint256')).toBeUndefined()
})

test('AbiEncodingArrayLengthMismatchError', () => {
  expect(
    new AbiEncodingArrayLengthMismatchError({
      expectedLength: 69,
      givenLength: 420,
      type: 'uint256[3]',
    }),
  ).toMatchInlineSnapshot(`
    [AbiEncodingArrayLengthMismatchError: ABI encoding array length mismatch for type uint256[3].
    Expected length: 69
    Given length: 420

    Version: viem@1.0.2]
  `)
})

test('AbiEncodingLengthMismatchError', () => {
  expect(
    new AbiEncodingLengthMismatchError({
      expectedLength: 69,
      givenLength: 420,
    }),
  ).toMatchInlineSnapshot(`
    [AbiEncodingLengthMismatchError: ABI encoding params/values length mismatch.
    Expected length (params): 69
    Given length (values): 420

    Version: viem@1.0.2]
  `)
})

test('InvalidAbiEncodingTypeError', () => {
  expect(new InvalidAbiEncodingTypeError('lol')).toMatchInlineSnapshot(`
    [InvalidAbiEncodingType: Type "lol" is not a valid encoding type.
    Please provide a valid ABI type.

    Docs: https://viem.sh/docs/contract/encodeAbi#params

    Version: viem@1.0.2]
  `)
})

test('InvalidArrayError', () => {
  expect(new InvalidArrayError('lol')).toMatchInlineSnapshot(`
    [InvalidArrayError: Value "lol" is not a valid array.

    Version: viem@1.0.2]
  `)
})
