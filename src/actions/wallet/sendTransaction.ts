import { prepareRequest } from '../../utils'
import type { WalletClient } from '../../clients'
import { BaseError, ChainMismatchError } from '../../errors'
import type {
  Address,
  Chain,
  Formatter,
  Hash,
  MergeIntersectionProperties,
  TransactionRequest,
} from '../../types'
import { Account } from '../../types/account'
import {
  Formatted,
  TransactionRequestFormatter,
  assertRequest,
  extract,
  format,
  formatTransactionRequest,
  getTransactionError,
} from '../../utils'
import { getChainId } from '../public'

export type FormattedTransactionRequest<
  TFormatter extends Formatter | undefined = Formatter,
> = MergeIntersectionProperties<
  Omit<Formatted<TFormatter, TransactionRequest, true>, 'from'>,
  TransactionRequest
>

export type SendTransactionArgs<TChain extends Chain = Chain> =
  FormattedTransactionRequest<TransactionRequestFormatter<TChain>> & {
    account: Account
  } & (
      | {
          assertChain?: false
          chain?: TChain
        }
      | {
          assertChain: true
          chain: TChain
        }
    )

export type SendTransactionResponse = Hash

export async function sendTransaction<TChain extends Chain>(
  client: WalletClient,
  args: SendTransactionArgs<TChain>,
): Promise<SendTransactionResponse> {
  const {
    account,
    chain,
    accessList,
    assertChain = true,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    ...rest
  } = args
  try {
    assertRequest(args)

    const currentChainId = await getChainId(client)
    if (assertChain && chain && currentChainId !== chain?.id)
      throw new ChainMismatchError({ chain, currentChainId })

    if (account.type === 'externally-owned') {
      const chainId = chain?.id ?? currentChainId

      // Prepare the request for signing (assign appropriate fees, etc.)
      const request = await prepareRequest(client, {
        account,
        accessList,
        chain,
        data,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value,
        ...rest,
      })

      const signedRequest = (await account.signTransaction({
        chainId,
        ...request,
      })) as Hash
      return await client.request({
        method: 'eth_sendRawTransaction',
        params: [signedRequest],
      })
    }

    const formatter = chain?.formatters?.transactionRequest
    const request = format(
      {
        accessList,
        data,
        from: account.address,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value,
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { formatter }),
      } as TransactionRequest,
      {
        formatter: formatter || formatTransactionRequest,
      },
    )
    return await client.request({
      method: 'eth_sendTransaction',
      params: [request],
    })
  } catch (err) {
    throw getTransactionError(err as BaseError, args)
  }
}
