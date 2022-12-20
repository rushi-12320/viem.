import { BaseError } from './BaseError'
import { withRetry } from './promise'
import { withTimeout } from './promise/withTimeout'

let id = 0

type Success<T> = {
  method?: never
  result: T
  error?: never
}
type Error<T> = {
  method?: never
  result?: never
  error: T
}
type Subscription<TResult, TError> = {
  method: 'eth_subscription'
  error?: never
  result?: never
  params: {
    subscription: string
  } & (
    | {
        result: TResult
        error?: never
      }
    | {
        result?: never
        error: TError
      }
  )
}

type RpcRequest = { method: string; params?: any[] }

export type RpcResponse<TResult = any, TError = any> = {
  jsonrpc: `${number}`
  id: number
} & (Success<TResult> | Error<TError> | Subscription<TResult, TError>)

///////////////////////////////////////////////////
// HTTP

async function http(
  url: string,
  {
    body,
    retryDelay = 100,
    retryCount = 2,
    timeout = 0,
  }: {
    // The RPC request body.
    body: RpcRequest
    // The base delay (in ms) between retries.
    retryDelay?: number
    // The max number of times to retry.
    retryCount?: number
    // The timeout (in ms) for the request.
    timeout?: number
  },
) {
  const response = await withRetry(
    () =>
      withTimeout(
        async ({ signal }) => {
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ jsonrpc: '2.0', id: id++, ...body }),
            signal: timeout > 0 ? signal : undefined,
          })
          return response
        },
        {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true,
        },
      ),
    {
      delay: ({ count, data }) => {
        // If we find a Retry-After header, let's retry after the given time.
        const retryAfter = data?.headers.get('Retry-After')
        if (retryAfter?.match(/\d/)) return parseInt(retryAfter) * 1000

        // Otherwise, let's retry with an exponential backoff.
        return ~~((Math.random() + 0.5) * (1 << count)) * retryDelay
      },
      retryCount,
      shouldRetryOnResponse: async ({ data }) => {
        if (data.status >= 500) return true
        if ([408, 413, 429].includes(data.status)) return true
        return false
      },
    },
  )

  let data
  if (response.headers.get('Content-Type')?.startsWith('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    throw new HttpRequestError({
      body,
      details: JSON.stringify(data.error) || response.statusText,
      status: response.status,
      url,
    })
  }

  if (data.error) {
    throw new RpcError({ body, error: data.error, url })
  }
  return data as RpcResponse
}

///////////////////////////////////////////////////
// WebSocket

type Id = string | number
type CallbackFn = (message: any) => void
type CallbackMap = Map<Id, CallbackFn>

export type Socket = WebSocket & {
  requests: CallbackMap
  subscriptions: CallbackMap
}

const sockets = new Map<string, Socket>()

export async function getSocket(url_: string) {
  const url = new URL(url_)
  const urlKey = url.toString()

  let socket = sockets.get(urlKey)

  // If the socket already exists, return it.
  if (socket) return socket

  const webSocket = new WebSocket(url)

  // Set up a cache for incoming "synchronous" requests.
  const requests = new Map<Id, CallbackFn>()

  // Set up a cache for subscriptions (eth_subscribe).
  const subscriptions = new Map<Id, CallbackFn>()

  const onMessage = ({ data }: { data: string }) => {
    const message: RpcResponse = JSON.parse(data)
    const isSubscription = message.method === 'eth_subscription'
    const id = isSubscription ? message.params.subscription : message.id
    const cache = isSubscription ? subscriptions : requests
    const callback = cache.get(id)
    if (callback) callback({ data })
    if (!isSubscription) cache.delete(id)
  }
  const onClose = () => {
    sockets.delete(urlKey)
    webSocket.removeEventListener('close', onClose)
    webSocket.removeEventListener('message', onMessage)
  }

  // Setup event listeners for RPC & subscription responses.
  webSocket.addEventListener('close', onClose)
  webSocket.addEventListener('message', onMessage)

  // Wait for the socket to open.
  if (webSocket.readyState === WebSocket.CONNECTING) {
    await new Promise((resolve, reject) => {
      if (!webSocket) return
      webSocket.onopen = resolve
      webSocket.onerror = reject
    })
  }

  // Create a new socket instance.
  socket = Object.assign(webSocket, {
    requests,
    subscriptions,
  })
  sockets.set(urlKey, socket)

  return socket
}

function webSocket(
  socket: Socket,
  {
    body,
    onData,
    onError,
  }: {
    // The RPC request body.
    body: RpcRequest
    // The callback to invoke when the request is successful.
    onData?: (message: RpcResponse) => void
    // The callback to invoke if the request errors.
    onError?: (message: RpcResponse['error']) => void
  },
) {
  if (
    socket.readyState === socket.CLOSED ||
    socket.readyState === socket.CLOSING
  )
    throw new WebSocketRequestError({
      body,
      url: socket.url,
      details: 'Socket is closed.',
    })

  const id_ = id++

  const callback = ({ data }: { data: any }) => {
    const message: RpcResponse = JSON.parse(data)

    if (typeof message.id === 'number' && id_ !== message.id) return

    if (message.error) {
      onError?.(new RpcError({ body, error: message.error, url: socket.url }))
    } else {
      onData?.(message)
    }

    // If we are subscribing to a topic, we want to set up a listener for incoming
    // messages.
    if (body.method === 'eth_subscribe' && typeof message.result === 'string') {
      socket.subscriptions.set(message.result, callback)
    }

    // If we are unsubscribing from a topic, we want to remove the listener.
    if (body.method === 'eth_unsubscribe') {
      socket.subscriptions.delete(body.params?.[0])
    }
  }
  socket.requests.set(id_, callback)

  socket.send(JSON.stringify({ jsonrpc: '2.0', ...body, id: id_ }))

  return socket
}

async function webSocketAsync(
  socket: Socket,
  {
    body,
    timeout = 0,
  }: {
    // The RPC request body.
    body: RpcRequest
    // The timeout (in ms) for the request.
    timeout?: number
  },
) {
  return withTimeout(
    () =>
      new Promise<RpcResponse>((onData, onError) =>
        rpc.webSocket(socket, {
          body,
          onData,
          onError,
        }),
      ),
    {
      errorInstance: new TimeoutError({ body, url: socket.url }),
      timeout,
    },
  )
}

///////////////////////////////////////////////////

export const rpc = {
  http,
  webSocket,
  webSocketAsync,
}

///////////////////////////////////////////////////
// Errors

export class HttpRequestError extends BaseError {
  name = 'HttpRequestError'
  status

  constructor({
    body,
    details,
    status,
    url,
  }: {
    body: { [key: string]: unknown }
    details: string
    status: number
    url: string
  }) {
    super({
      humanMessage: [
        'HTTP request failed.',
        '',
        `Status: ${status}`,
        `URL: ${url}`,
        `Request body: ${JSON.stringify(body)}`,
      ].join('\n'),
      details,
    })
    this.status = status
  }
}

export class WebSocketRequestError extends BaseError {
  name = 'WebSocketRequestError'

  constructor({
    body,
    details,
    url,
  }: {
    body: { [key: string]: unknown }
    details: string
    url: string
  }) {
    super({
      humanMessage: [
        'WebSocket request failed.',
        '',
        `URL: ${url}`,
        `Request body: ${JSON.stringify(body)}`,
      ].join('\n'),
      details,
    })
  }
}

export class RpcError extends BaseError {
  code: number

  name = 'RpcError'

  constructor({
    body,
    error,
    url,
  }: {
    body: { [key: string]: unknown }
    error: { code: number; message: string }
    url: string
  }) {
    super({
      humanMessage: [
        'RPC Request failed.',
        '',
        `URL: ${url}`,
        `Request body: ${JSON.stringify(body)}`,
      ].join('\n'),
      details: error.message,
    })
    this.code = error.code
  }
}

export class TimeoutError extends BaseError {
  name = 'TimeoutError'

  constructor({
    body,
    url,
  }: {
    body: { [key: string]: unknown }
    url: string
  }) {
    super({
      humanMessage: [
        'The request took too long to respond.',
        '',
        `URL: ${url}`,
        `Request body: ${JSON.stringify(body)}`,
      ].join('\n'),
      details: 'The request timed out.',
    })
  }
}
