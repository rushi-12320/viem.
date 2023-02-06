import { expect, test } from 'vitest'

import * as utils from './index'

test('exports utils', () => {
  expect(utils).toMatchInlineSnapshot(`
    {
      "labelhash": [Function],
      "namehash": [Function],
      "normalize": [Function],
    }
  `)
})
