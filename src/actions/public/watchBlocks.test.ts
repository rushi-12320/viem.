import { describe, expect, test, vi } from 'vitest'

import type { OnBlockParameter } from './watchBlocks'
import * as getBlock from './getBlock'
import { watchBlocks } from './watchBlocks'
import { mine } from '../test/mine'
import { accounts, publicClient, testClient, walletClient } from '../../_test'
import { wait } from '../../utils/wait'
import { celo, Chain, localhost } from '../../chains'
import { createPublicClient, http } from '../../clients'
import { setIntervalMining } from '../test'
import { sendTransaction } from '../wallet'
import { getAccount, parseEther } from '../../utils'
import { Block } from '../../types'

test('watches for new blocks', async () => {
  const blocks: OnBlockParameter[] = []
  const prevBlocks: OnBlockParameter[] = []
  const unwatch = watchBlocks(publicClient, {
    onBlock: (block, prevBlock) => {
      blocks.push(block)
      prevBlock && block !== prevBlock && prevBlocks.push(prevBlock)
    },
  })
  await wait(5000)
  unwatch()
  expect(blocks.length).toBe(4)
  expect(prevBlocks.length).toBe(3)
})

test(
  'args: includeTransactions',
  async () => {
    await mine(testClient, { blocks: 1 })

    const blocks: OnBlockParameter<Chain, true>[] = []
    const unwatch = watchBlocks(publicClient, {
      includeTransactions: true,
      onBlock: (block) => {
        blocks.push(block)
      },
    })

    await sendTransaction(walletClient, {
      account: getAccount(accounts[0].address),
      to: accounts[1].address,
      value: parseEther('1'),
    })
    await wait(2000)

    unwatch()
    expect(blocks.length).toBe(1)
    expect(blocks[0].transactions.length).toBe(1)
  },
  { retry: 3 },
)

describe('emitMissed', () => {
  test('emits on missed blocks', async () => {
    await setIntervalMining(testClient, { interval: 0 })
    const blocks: OnBlockParameter[] = []
    const unwatch = watchBlocks(publicClient, {
      emitMissed: true,
      onBlock: (block) => blocks.push(block),
      pollingInterval: 500,
    })
    await mine(testClient, { blocks: 1 })
    await wait(1000)
    await mine(testClient, { blocks: 5 })
    await wait(1000)
    unwatch()
    expect(blocks.length).toBe(6)
    await setIntervalMining(testClient, { interval: 1 })
  })
})

describe('emitOnBegin', () => {
  test('watches for new blocks', async () => {
    const blocks: OnBlockParameter[] = []
    const unwatch = watchBlocks(publicClient, {
      emitOnBegin: true,
      onBlock: (block) => blocks.push(block),
    })
    await wait(5000)
    unwatch()
    expect(blocks.length).toBe(5)
  })
})

describe('pollingInterval on client', () => {
  test('watches for new blocks', async () => {
    const client = createPublicClient({
      chain: localhost,
      transport: http(),
      pollingInterval: 500,
    })

    const blocks: OnBlockParameter[] = []
    const unwatch = watchBlocks(client, {
      onBlock: (block) => blocks.push(block),
    })
    await wait(2000)
    unwatch()
    expect(blocks.length).toBe(2)
  })
})

test('custom chain type', async () => {
  const client = createPublicClient({
    chain: celo,
    transport: http(),
  })

  const blocks: OnBlockParameter<typeof celo>[] = []
  const unwatch = watchBlocks(client, {
    emitOnBegin: true,
    onBlock: (block) => blocks.push(block),
  })
  await wait(2000)
  unwatch()
  expect(blocks[0].randomness).toBeDefined()
})

describe('behavior', () => {
  test('does not emit when no new incoming blocks', async () => {
    const blocks: OnBlockParameter[] = []
    const unwatch = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
      pollingInterval: 100,
    })
    await wait(1200)
    unwatch()
    expect(blocks.length).toBe(2)
  })

  test('watch > unwatch > watch', async () => {
    let blocks: OnBlockParameter[] = []
    let unwatch = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    await wait(3000)
    unwatch()
    expect(blocks.length).toBe(2)

    blocks = []
    unwatch = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    await wait(3000)
    unwatch()
    expect(blocks.length).toBe(2)
  })

  test('multiple watchers', async () => {
    let blocks: OnBlockParameter[] = []

    let unwatch1 = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    let unwatch2 = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    let unwatch3 = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    await wait(3000)
    unwatch1()
    unwatch2()
    unwatch3()
    expect(blocks.length).toBe(6)

    blocks = []

    unwatch1 = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    unwatch2 = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    unwatch3 = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    await wait(3000)
    unwatch1()
    unwatch2()
    unwatch3()
    expect(blocks.length).toBe(6)
  })

  test('immediately unwatch', async () => {
    const blocks: OnBlockParameter[] = []
    const unwatch = watchBlocks(publicClient, {
      onBlock: (block) => blocks.push(block),
    })
    unwatch()
    await wait(3000)
    expect(blocks.length).toBe(0)
  })

  test('out of order blocks', async () => {
    vi.spyOn(getBlock, 'getBlock')
      .mockResolvedValueOnce({ number: 420n } as Block)
      .mockResolvedValueOnce({ number: 421n } as Block)
      .mockResolvedValueOnce({ number: 419n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 426n } as Block)
      .mockResolvedValueOnce({ number: 423n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 429n } as Block)
      .mockResolvedValueOnce({ number: 430n } as Block)

    const blocks: [OnBlockParameter, OnBlockParameter | undefined][] = []
    const unwatch = watchBlocks(publicClient, {
      pollingInterval: 100,
      onBlock: (block, prevBlock) => blocks.push([block, prevBlock]),
    })
    await wait(1000)
    unwatch()
    expect(blocks).toMatchInlineSnapshot(`
      [
        [
          {
            "number": 420n,
          },
          undefined,
        ],
        [
          {
            "number": 421n,
          },
          {
            "number": 420n,
          },
        ],
        [
          {
            "number": 424n,
          },
          {
            "number": 421n,
          },
        ],
        [
          {
            "number": 426n,
          },
          {
            "number": 424n,
          },
        ],
        [
          {
            "number": 429n,
          },
          {
            "number": 426n,
          },
        ],
      ]
    `)
  })

  test('out of order blocks (emitMissed)', async () => {
    vi.spyOn(getBlock, 'getBlock')
      .mockResolvedValueOnce({ number: 420n } as Block)
      .mockResolvedValueOnce({ number: 421n } as Block)
      .mockResolvedValueOnce({ number: 419n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 422n } as Block)
      .mockResolvedValueOnce({ number: 423n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 426n } as Block)
      .mockResolvedValueOnce({ number: 425n } as Block)
      .mockResolvedValueOnce({ number: 423n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 429n } as Block)
      .mockResolvedValueOnce({ number: 427n } as Block)
      .mockResolvedValueOnce({ number: 428n } as Block)
      .mockResolvedValueOnce({ number: 429n } as Block)

    const blocks: [OnBlockParameter, OnBlockParameter | undefined][] = []
    const unwatch = watchBlocks(publicClient, {
      emitMissed: true,
      pollingInterval: 100,
      onBlock: (block, prevBlock) => blocks.push([block, prevBlock]),
    })
    await wait(1000)
    unwatch()
    expect(blocks).toMatchInlineSnapshot(`
      [
        [
          {
            "number": 420n,
          },
          undefined,
        ],
        [
          {
            "number": 421n,
          },
          {
            "number": 420n,
          },
        ],
        [
          {
            "number": 422n,
          },
          {
            "number": 421n,
          },
        ],
        [
          {
            "number": 423n,
          },
          {
            "number": 422n,
          },
        ],
        [
          {
            "number": 424n,
          },
          {
            "number": 423n,
          },
        ],
        [
          {
            "number": 425n,
          },
          {
            "number": 424n,
          },
        ],
        [
          {
            "number": 426n,
          },
          {
            "number": 425n,
          },
        ],
        [
          {
            "number": 427n,
          },
          {
            "number": 426n,
          },
        ],
        [
          {
            "number": 428n,
          },
          {
            "number": 427n,
          },
        ],
        [
          {
            "number": 429n,
          },
          {
            "number": 428n,
          },
        ],
      ]
    `)
  })

  test('pending blocks (no number)', async () => {
    vi.spyOn(getBlock, 'getBlock')
      .mockResolvedValueOnce({ number: 420n } as Block)
      .mockResolvedValueOnce({ number: 424n } as Block)
      .mockResolvedValueOnce({ number: 428n } as Block)
      .mockResolvedValueOnce({ number: 431n } as Block)
      .mockResolvedValueOnce({ number: null } as Block)
      .mockResolvedValueOnce({ number: 433n } as Block)
      .mockResolvedValueOnce({ number: null } as Block)
      .mockResolvedValueOnce({ number: null } as Block)
      .mockResolvedValueOnce({ number: null } as Block)
      .mockResolvedValueOnce({ number: null } as Block)
      .mockResolvedValueOnce({ number: null } as Block)
      .mockResolvedValueOnce({ number: null } as Block)

    const blocks: [OnBlockParameter, OnBlockParameter | undefined][] = []
    const unwatch = watchBlocks(publicClient, {
      pollingInterval: 100,
      blockTag: 'pending',
      onBlock: (block, prevBlock) => blocks.push([block, prevBlock]),
    })
    await wait(1000)
    unwatch()
    expect(blocks).toMatchInlineSnapshot(`
      [
        [
          {
            "number": 420n,
          },
          undefined,
        ],
        [
          {
            "number": 424n,
          },
          {
            "number": 420n,
          },
        ],
        [
          {
            "number": 428n,
          },
          {
            "number": 424n,
          },
        ],
        [
          {
            "number": 431n,
          },
          {
            "number": 428n,
          },
        ],
        [
          {
            "number": null,
          },
          {
            "number": 431n,
          },
        ],
        [
          {
            "number": 433n,
          },
          {
            "number": null,
          },
        ],
        [
          {
            "number": null,
          },
          {
            "number": 433n,
          },
        ],
        [
          {
            "number": null,
          },
          {
            "number": null,
          },
        ],
        [
          {
            "number": null,
          },
          {
            "number": null,
          },
        ],
      ]
    `)
  })
})

describe('errors', () => {
  test('handles error thrown', async () => {
    vi.spyOn(getBlock, 'getBlock').mockRejectedValue(new Error('foo'))

    let unwatch: () => void = () => null
    const error = await new Promise((resolve) => {
      unwatch = watchBlocks(publicClient, {
        onBlock: () => null,
        onError: resolve,
      })
    })
    expect(error).toMatchInlineSnapshot('[Error: foo]')
    unwatch()
  })
})
