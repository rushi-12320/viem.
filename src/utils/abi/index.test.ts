import { expect, test } from 'vitest'

import * as utils from './index'

test('exports utils', () => {
  expect(utils).toMatchInlineSnapshot(`
    {
      "decodeAbi": [Function],
      "decodeErrorResult": [Function],
      "decodeEventLog": [Function],
      "decodeFunctionData": [Function],
      "decodeFunctionResult": [Function],
      "encodeAbi": [Function],
      "encodeDeployData": [Function],
      "encodeErrorResult": [Function],
      "encodeEventTopics": [Function],
      "encodeFunctionData": [Function],
      "encodeFunctionResult": [Function],
      "formatAbiItem": [Function],
      "formatAbiItemWithArgs": [Function],
      "getAbiItem": [Function],
    }
  `)
})
