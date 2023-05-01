import { call } from '../actions/public/call.js'
import type { CallParameters } from '../actions/public/index.js'
import type { PublicClient, Transport } from '../clients/index.js'
import {
  BaseError,
  HttpRequestError,
  OffchainLookupError,
  OffchainLookupResponseMalformedError,
  OffchainLookupSenderMismatchError,
} from '../errors/index.js'
import type { Chain, GetErrorArgs, Hex } from '../types/index.js'
import { decodeErrorResult, encodeAbiParameters } from './abi/index.js'
import { isAddressEqual } from './address/index.js'
import { concat, isHex } from './data/index.js'
import { stringify } from './stringify.js'
import type { Abi, Address } from 'abitype'

export const offchainLookupSignature = '0x556f1830'
export const offchainLookupAbiItem = {
  name: 'OffchainLookup',
  type: 'error',
  inputs: [
    {
      name: 'sender',
      type: 'address',
    },
    {
      name: 'urls',
      type: 'string[]',
    },
    {
      name: 'callData',
      type: 'bytes',
    },
    {
      name: 'callbackFunction',
      type: 'bytes4',
    },
    {
      name: 'extraData',
      type: 'bytes',
    },
  ],
} as const satisfies Abi[number]

export async function offchainLookup<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  {
    blockNumber,
    blockTag,
    data,
    to,
  }: Pick<CallParameters, 'blockNumber' | 'blockTag'> & {
    data: Hex
    to: Address
  },
): Promise<Hex> {
  const { args } = decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem],
  }) as unknown as GetErrorArgs<
    [typeof offchainLookupAbiItem],
    'OffchainLookup'
  >
  const [sender, urls, callData, callbackSelector, extraData] = args

  try {
    if (!isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to })

    const result = await ccipFetch({ data: callData, sender, urls })

    const { data: data_ } = await call(client, {
      blockNumber,
      blockTag,
      data: concat([
        callbackSelector,
        encodeAbiParameters(
          [{ type: 'bytes' }, { type: 'bytes' }],
          [result, extraData],
        ),
      ]),
      to,
    } as CallParameters)

    return data_!
  } catch (err) {
    throw new OffchainLookupError({
      callbackSelector,
      cause: err as BaseError,
      data,
      extraData,
      sender,
      urls,
    })
  }
}

export async function ccipFetch({
  data,
  sender,
  urls,
}: { data: Hex; sender: Address; urls: readonly string[] }) {
  let error = new Error('An unknown error occurred.')

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const method =
      url.includes('{sender}') || url.includes('{data}') ? 'GET' : 'POST'
    const body = method === 'POST' ? { data, sender } : undefined

    try {
      const response = await fetch(
        url.replace('{sender}', sender).replace('{data}', data),
        {
          body: JSON.stringify(body),
          method,
        },
      )

      let result
      if (
        response.headers.get('Content-Type')?.startsWith('application/json')
      ) {
        result = (await response.json()).data
      } else {
        result = (await response.text()) as any
      }

      if (!response.ok) {
        error = new HttpRequestError({
          body,
          details: stringify(result.error) || response.statusText,
          headers: response.headers,
          status: response.status,
          url,
        })
        continue
      }

      if (!isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url,
        })
        continue
      }

      return result
    } catch (err) {
      error = new HttpRequestError({
        body,
        details: (err as Error).message,
        url,
      })
    }
  }

  throw error
}
