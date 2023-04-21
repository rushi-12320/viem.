import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'

import { cleanupCache, listenersCache } from '../utils/observe.js'
import { promiseCache, responseCache } from '../utils/promise/withCache.js'
import { setBlockNumber, testClient } from './utils.js'
import { setAutomine, setIntervalMining } from '../test.js'

beforeAll(() => {
  vi.mock('../errors/utils.ts', () => ({
    getContractAddress: vi
      .fn()
      .mockReturnValue('0x0000000000000000000000000000000000000000'),
    getUrl: vi.fn().mockReturnValue('http://localhost'),
    getVersion: vi.fn().mockReturnValue('viem@1.0.2'),
  }))
})

beforeEach(() => {
  promiseCache.clear()
  responseCache.clear()
  listenersCache.clear()
  cleanupCache.clear()
})

afterAll(async () => {
  vi.restoreAllMocks()

  // Reset the anvil instance to the same state it was in before the tests started.
  await Promise.all([
    setBlockNumber(BigInt(Number(process.env.VITE_ANVIL_BLOCK_NUMBER))),
    setAutomine(testClient, false),
    setIntervalMining(testClient, { interval: 1 }),
  ])
})

afterEach((context) => {
  // Print the last log entries from anvil after each test.
  context.onTestFailed(async (result) => {
    try {
      const pool = process.env.VITEST_POOL_ID ?? 1
      const response = await fetch(`http://127.0.0.1:8545/${pool}/logs`)
      const logs = (((await response.json()) ?? []) as string[])
        .slice(1)
        .slice(-20)

      if (!Array.isArray(logs) || logs.length === 0) {
        return
      }

      // Try to append the log messages to the vitest error message if possible. Otherwise, print them to the console.
      const error = result.errors?.[0]
      const label =
        'Anvil log output\n=======================================\n'

      if (error !== undefined) {
        error.message += `\n\n${label}`
        error.message += `\n${logs.join('\n')}`
      } else {
        console.group(label)

        for (const log of logs) {
          console.log(log)
        }

        console.groupEnd()
      }
    } catch {}
  })
})
