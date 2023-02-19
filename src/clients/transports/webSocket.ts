import WebSocket from 'isomorphic-ws'
import { UrlRequiredError } from '../../errors'
import type { Hash } from '../../types'
import type { RpcResponse } from '../../utils/rpc'
import { getSocket, rpc } from '../../utils/rpc'
import type { Transport, TransportConfig } from './createTransport'
import { createTransport } from './createTransport'

type WebSocketTransportSubscribeArgs = {
  onData: (data: RpcResponse) => void
  onError?: (error: any) => void
}

type WebSocketTransportSubscribeResponse = {
  subscriptionId: Hash
  unsubscribe: () => Promise<RpcResponse<boolean>>
}

type WebSocketTransportSubscribe = {
  subscribe(
    args: WebSocketTransportSubscribeArgs & {
      /**
       * @description Add information about compiled contracts
       * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_addcompilationresult
       */
      params: ['newHeads']
    },
  ): Promise<WebSocketTransportSubscribeResponse>
}

export type WebSocketTransportConfig = {
  /** The key of the WebSocket transport. */
  key?: TransportConfig['key']
  /** The name of the WebSocket transport. */
  name?: TransportConfig['name']
  /** The max number of times to retry. */
  retryCount?: TransportConfig['retryCount']
  /** The base delay (in ms) between retries. */
  retryDelay?: TransportConfig['retryDelay']
  /** The timeout (in ms) for async WebSocket requests. Default: 10_000 */
  timeout?: TransportConfig['timeout']
}

export type WebSocketTransport = Transport<
  'webSocket',
  {
    getSocket(): Promise<WebSocket>
    subscribe: WebSocketTransportSubscribe['subscribe']
  }
>

/**
 * @description Creates a WebSocket transport that connects to a JSON-RPC API.
 */
export function webSocket(
  /** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
  url?: string,
  config: WebSocketTransportConfig = {},
): WebSocketTransport {
  const {
    key = 'webSocket',
    name = 'WebSocket JSON-RPC',
    retryDelay,
    timeout = 10_000,
  } = config
  return ({ chain, retryCount: defaultRetryCount }) => {
    const retryCount = config.retryCount ?? defaultRetryCount
    const url_ = url || chain?.rpcUrls.default.webSocket?.[0]
    if (!url_) throw new UrlRequiredError()
    return createTransport(
      {
        key,
        name,
        async request({ method, params }) {
          const socket = await getSocket(url_)
          const { result } = await rpc.webSocketAsync(socket, {
            body: { method, params },
            timeout,
          })
          return result
        },
        retryCount,
        retryDelay,
        timeout,
        type: 'webSocket',
      },
      {
        getSocket() {
          return getSocket(url_)
        },
        async subscribe({ params, onData, onError }: any) {
          const socket = await getSocket(url_)
          const { result: subscriptionId } = await new Promise<any>(
            (resolve, reject) =>
              rpc.webSocket(socket, {
                body: {
                  method: 'eth_subscribe',
                  params,
                },
                onData: (data) => {
                  if (typeof data.id === 'number') {
                    resolve(data)
                    return
                  }
                  onData(data)
                },
                onError: (error) => {
                  reject(error)
                  onError?.(error)
                },
              }),
          )
          return {
            subscriptionId,
            async unsubscribe() {
              return new Promise<any>((resolve, reject) =>
                rpc.webSocket(socket, {
                  body: {
                    method: 'eth_unsubscribe',
                    params: [subscriptionId],
                  },
                  onData: resolve,
                  onError: reject,
                }),
              )
            },
          }
        },
      },
    )
  }
}
