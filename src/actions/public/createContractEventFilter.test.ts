import { assertType, expect, test } from 'vitest'

import {
  accounts,
  createHttpServer,
  initialBlockNumber,
  publicClient,
  usdcContractConfig,
} from '../../_test/index.js'
import { createPublicClient, fallback, http } from '../../clients/index.js'
import type { Requests } from '../../types/eip1193.js'

import { createContractEventFilter } from './createContractEventFilter.js'

const request = (() => {}) as unknown as Requests['request']

test('default', async () => {
  const filter = await createContractEventFilter(publicClient, {
    abi: usdcContractConfig.abi,
  })
  assertType<typeof filter>({
    abi: usdcContractConfig.abi,
    id: '0x',
    type: 'event',
    args: undefined,
    eventName: undefined,
    request,
  })
  expect(filter.id).toBeDefined()
  expect(filter.type).toBe('event')
  expect(filter.args).toBeUndefined()
  expect(filter.eventName).toBeUndefined()
})

test('args: address', async () => {
  const filter = await createContractEventFilter(publicClient, {
    address: usdcContractConfig.address,
    abi: usdcContractConfig.abi,
  })
  expect(filter.id).toBeDefined()
})

test('args: args', async () => {
  const filter = await createContractEventFilter(publicClient, {
    address: usdcContractConfig.address,
    abi: usdcContractConfig.abi,
    eventName: 'Transfer',
    args: {
      from: accounts[0].address,
      to: accounts[0].address,
    },
  })
  expect(filter.abi).toEqual(usdcContractConfig.abi)
  expect(filter.args).toEqual({
    from: accounts[0].address,
    to: accounts[0].address,
  })
  expect(filter.eventName).toEqual('Transfer')

  const filter2 = await createContractEventFilter(publicClient, {
    address: usdcContractConfig.address,
    abi: usdcContractConfig.abi,
    eventName: 'Transfer',
    args: {
      from: accounts[0].address,
    },
  })
  expect(filter.abi).toEqual(usdcContractConfig.abi)
  expect(filter2.args).toEqual({
    from: accounts[0].address,
  })
  expect(filter.eventName).toEqual('Transfer')

  const filter3 = await createContractEventFilter(publicClient, {
    address: usdcContractConfig.address,
    abi: usdcContractConfig.abi,
    eventName: 'Transfer',
    args: {
      to: [accounts[0].address, accounts[1].address],
    },
  })
  expect(filter.abi).toEqual(usdcContractConfig.abi)
  expect(filter3.args).toEqual({
    to: [accounts[0].address, accounts[1].address],
  })
  expect(filter3.eventName).toEqual('Transfer')
})

test('args: fromBlock', async () => {
  expect(
    (
      await createContractEventFilter(publicClient, {
        address: usdcContractConfig.address,
        abi: usdcContractConfig.abi,
        eventName: 'Transfer',
        fromBlock: 'latest',
      })
    ).id,
  ).toBeDefined()
  expect(
    (
      await createContractEventFilter(publicClient, {
        address: usdcContractConfig.address,
        abi: usdcContractConfig.abi,
        eventName: 'Transfer',
        fromBlock: initialBlockNumber,
      })
    ).id,
  ).toBeDefined()
})

test('args: toBlock', async () => {
  expect(
    (
      await createContractEventFilter(publicClient, {
        address: usdcContractConfig.address,
        abi: usdcContractConfig.abi,
        eventName: 'Transfer',
        toBlock: 'latest',
      })
    ).id,
  ).toBeDefined()
  expect(
    (
      await createContractEventFilter(publicClient, {
        address: usdcContractConfig.address,
        abi: usdcContractConfig.abi,
        eventName: 'Transfer',
        toBlock: initialBlockNumber,
      })
    ).id,
  ).toBeDefined()
})

test('fallback client: scopes request', async () => {
  let count1 = 0
  const server1 = await createHttpServer((_req, res) => {
    count1++
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    res.end(
      JSON.stringify({
        error: { code: -32004, message: 'method not supported' },
      }),
    )
  })

  let count2 = 0
  const server2 = await createHttpServer((_req, res) => {
    count2++
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify({ result: '0x1' }))
  })

  const fallbackClient = createPublicClient({
    transport: fallback([http(server1.url), http(server2.url)], {
      rank: false,
    }),
  })
  const filter = await createContractEventFilter(fallbackClient, {
    abi: usdcContractConfig.abi,
  })
  expect(filter).toBeDefined()
  expect(count1).toBe(1)
  expect(count2).toBe(1)

  await filter.request({ method: 'eth_getFilterChanges', params: [filter.id] })
  expect(count1).toBe(1)
  expect(count2).toBe(2)
})
