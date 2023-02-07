import { assertType, describe, expect, test } from 'vitest'

import { localWsUrl } from '../../_test'
import { localhost } from '../../chains'
import { wait } from '../../utils/wait'
import type { WebSocketTransport } from './webSocket'
import { webSocket } from './webSocket'

test('default', () => {
  const transport = webSocket(localWsUrl)

  assertType<WebSocketTransport>(transport)
  assertType<'webSocket'>(transport({}).config.type)

  expect(transport).toMatchInlineSnapshot('[Function]')
})

describe('config', () => {
  test('key', () => {
    const transport = webSocket(localWsUrl, {
      key: 'mock',
    })

    expect(transport({})).toMatchInlineSnapshot(`
      {
        "config": {
          "key": "mock",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "type": "webSocket",
        },
        "value": {
          "getSocket": [Function],
          "subscribe": [Function],
        },
      }
    `)
  })

  test('name', () => {
    const transport = webSocket(localWsUrl, {
      name: 'Mock Transport',
    })

    expect(transport({})).toMatchInlineSnapshot(`
      {
        "config": {
          "key": "webSocket",
          "name": "Mock Transport",
          "request": [Function],
          "type": "webSocket",
        },
        "value": {
          "getSocket": [Function],
          "subscribe": [Function],
        },
      }
    `)
  })

  test('url', () => {
    const transport = webSocket('https://mockapi.com/rpc')

    expect(transport({})).toMatchInlineSnapshot(`
      {
        "config": {
          "key": "webSocket",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "type": "webSocket",
        },
        "value": {
          "getSocket": [Function],
          "subscribe": [Function],
        },
      }
    `)
  })
})

test('getSocket', async () => {
  const transport = webSocket(localWsUrl)
  const socket = await transport({}).value?.getSocket()
  expect(socket).toBeDefined()
  expect(socket?.readyState).toBe(WebSocket.OPEN)
})

test('request', async () => {
  const transport = webSocket(undefined, {
    key: 'jsonRpc',
    name: 'JSON RPC',
  })

  expect(
    await transport({
      chain: {
        ...localhost,
        rpcUrls: {
          public: { http: [localWsUrl], webSocket: [localWsUrl] },
          default: { http: [localWsUrl], webSocket: [localWsUrl] },
        },
      },
    }).config.request({
      method: 'eth_blockNumber',
    }),
  ).toBeDefined()
})

test('subscribe', async () => {
  const transport = webSocket(localWsUrl, {
    key: 'jsonRpc',
    name: 'JSON RPC',
  })({})
  if (!transport.value) return

  let blocks: any[] = []
  const { subscriptionId, unsubscribe } = await transport.value.subscribe({
    params: ['newHeads'],
    onData: (data) => blocks.push(data),
  })

  // Make sure we are subscribed.
  expect(subscriptionId).toBeDefined()

  // Make sure we are receiving blocks.
  await wait(2000)
  expect(blocks.length).toBe(2)

  // Make sure we unsubscribe.
  const { result } = await unsubscribe()
  expect(result).toBeDefined()

  // Make sure we are no longer receiving blocks.
  await wait(2000)
  expect(blocks.length).toBe(2)
})

test('throws on bogus subscription', async () => {
  const transport = webSocket(localWsUrl, {
    key: 'jsonRpc',
    name: 'JSON RPC',
  })

  let errors: any[] = []
  await expect(() =>
    transport({}).value?.subscribe({
      // @ts-expect-error - testing
      params: ['lol'],
      onData: () => null,
      onError: (err) => errors.push(err),
    }),
  ).rejects.toThrowError()
  expect(errors.length).toBeGreaterThan(0)
})

test('no url', () => {
  expect(() => webSocket()({})).toThrowErrorMatchingInlineSnapshot(`
    "No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.

    Docs: https://viem.sh/docs/clients/intro
    Version: viem@1.0.2"
  `)
})
