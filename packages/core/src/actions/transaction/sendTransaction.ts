import type { WalletClient } from '../../clients'
import type { TransactionRequest } from '../../types'
import { BaseError, formatTransactionRequest } from '../../utils'

export type SendTransactionArgs = {
  request: TransactionRequest
}

export type SendTransactionResponse = { hash: `0x${string}` }

export async function sendTransaction(
  client: WalletClient,
  { request }: SendTransactionArgs,
): Promise<SendTransactionResponse> {
  if (
    request.maxFeePerGas !== undefined &&
    request.maxPriorityFeePerGas !== undefined &&
    request.maxFeePerGas < request.maxPriorityFeePerGas
  )
    throw new InvalidGasArgumentsError()

  const hash = await client.request({
    method: 'eth_sendTransaction',
    params: [formatTransactionRequest(request)],
  })
  return { hash }
}

export class InvalidGasArgumentsError extends BaseError {
  name = 'InvalidGasArgumentsError'

  constructor() {
    super({
      humanMessage: 'Gas values provided are invalid.',
      details: 'maxFeePerGas cannot be less than maxPriorityFeePerGas',
    })
  }
}
