import { expect, test } from 'vitest'

import * as utils from './index'

test('exports utils', () => {
  expect(utils).toMatchInlineSnapshot(`
    {
      "decodeAbi": [Function],
      "decodeErrorResult": [Function],
      "decodeFunctionData": [Function],
      "decodeFunctionResult": [Function],
      "encodeAbi": [Function],
      "encodeDeployData": [Function],
      "encodeErrorResult": [Function],
      "encodeEventTopics": [Function],
      "encodeFunctionData": [Function],
      "encodeFunctionResult": [Function],
      "formatAbiItemWithArgs": [Function],
      "formatAbiItemWithParams": [Function],
      "getAbiItem": [Function],
    }
  `)
})
