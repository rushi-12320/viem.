import { expect, test } from 'vitest'
import {
  publicClientMainnet,
  sepoliaClient,
} from '../../../../test/src/utils.js'
import { base, optimismSepolia } from '../chains.js'
import { getL2Output } from './getL2Output.js'

test('default', async () => {
  const output = await getL2Output(publicClientMainnet, {
    l2BlockNumber: 2725977n,
    targetChain: base,
  })
  expect(output).toMatchInlineSnapshot(`
    {
      "l2BlockNumber": 2727000n,
      "outputIndex": 1514n,
      "outputRoot": "0xff22d9720c41431eb398a07c5b315199f8f0dc6a07643e4e43a20b910f12f2f2",
      "timestamp": 1692244499n,
    }
  `)
})

// TODO(fault-proofs): use `publicClient` when fault proofs deployed to mainnet.
test('portal v3', async () => {
  const game = await getL2Output(sepoliaClient, {
    targetChain: optimismSepolia,
    l2BlockNumber: 9510398n,
    limit: 10,
  })
  expect(game).toHaveProperty('l2BlockNumber')
  expect(game).toHaveProperty('outputIndex')
  expect(game).toHaveProperty('outputRoot')
  expect(game).toHaveProperty('timestamp')
})
