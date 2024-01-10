import { beforeAll, expect, test, vi } from 'vitest'
import { optimismClient } from '../../../../test/src/opStack.js'
import { publicClient, setBlockNumber } from '../../../../test/src/utils.js'
import { getTransactionReceipt } from '../../../actions/index.js'
import { getWithdrawals, optimism } from '../index.js'
import { getTimeToFinalize } from './getTimeToFinalize.js'

beforeAll(async () => {
  await setBlockNumber(18770525n)
})

test('default', async () => {
  const receipt = await getTransactionReceipt(optimismClient, {
    hash: '0x9a2f4283636ddeb9ac32382961b22c177c9e86dd3b283735c154f897b1a7ff4a',
  })

  const [withdrawal] = getWithdrawals(receipt)

  vi.setSystemTime(new Date(1702399191000))

  const time = await getTimeToFinalize(publicClient, {
    ...withdrawal!,
    targetChain: optimism,
  })

  vi.useRealTimers()

  expect(time).toMatchInlineSnapshot(`
    {
      "period": 604800,
      "seconds": 594810,
      "timestamp": 1702994001000,
    }
  `)
})

test('ready to finalize', async () => {
  const receipt = await getTransactionReceipt(optimismClient, {
    hash: '0x9a2f4283636ddeb9ac32382961b22c177c9e86dd3b283735c154f897b1a7ff4a',
  })

  const [withdrawal] = getWithdrawals(receipt)

  vi.setSystemTime(new Date(1702994990587))

  const time = await getTimeToFinalize(publicClient, {
    ...withdrawal!,
    targetChain: optimism,
  })

  vi.useRealTimers()

  expect(time).toMatchInlineSnapshot(`
    {
      "period": 604800,
      "seconds": 0,
      "timestamp": 1702994990587,
    }
  `)
})
