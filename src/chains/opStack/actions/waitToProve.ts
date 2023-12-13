import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import type { ErrorType } from '../../../errors/utils.js'
import type { Account } from '../../../types/account.js'
import type {
  Chain,
  DeriveChain,
  GetChainParameter,
} from '../../../types/chain.js'
import type { Log } from '../../../types/log.js'
import type { GetContractAddressParameter } from '../types/contract.js'
import {
  type GetWithdrawalMessagesErrorType,
  type GetWithdrawalMessagesReturnType,
  getWithdrawalMessages,
} from '../utils/getWithdrawalMessages.js'
import {
  type WaitForL2OutputErrorType,
  type WaitForL2OutputReturnType,
  waitForL2Output,
} from './waitForL2Output.js'

export type WaitToProveParameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = GetChainParameter<chain, chainOverride> &
  GetContractAddressParameter<_derivedChain, 'l2OutputOracle'> & {
    receipt: {
      blockNumber: bigint
      logs: Log[]
    }
    /**
     * Polling frequency (in ms). Defaults to Client's pollingInterval config.
     * @default client.pollingInterval
     */
    pollingInterval?: number
  }
export type WaitToProveReturnType = {
  message: GetWithdrawalMessagesReturnType[0]
  output: WaitForL2OutputReturnType
}
export type WaitToProveErrorType =
  | GetWithdrawalMessagesErrorType
  | WaitForL2OutputErrorType
  | ErrorType

/**
 * Waits until the L2 withdrawal transaction is provable. Used for the [Withdrawal](/op-stack/guides/withdrawals.html) flow.
 *
 * - Docs: https://viem.sh/op-stack/actions/waitToProve.html
 *
 * @param client - Client to use
 * @param parameters - {@link WaitToProveParameters}
 * @returns The L2 output and withdrawal message. {@link WaitToProveReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { getBlockNumber } from 'viem/actions'
 * import { mainnet, optimism } from 'viem/chains'
 * import { waitToProve } from 'viem/op-stack'
 *
 * const publicClientL1 = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const publicClientL2 = createPublicClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const receipt = await getTransactionReceipt(publicClientL2, { hash: '0x...' })
 * await waitToProve(publicClientL1, {
 *   receipt,
 *   targetChain: optimism
 * })
 */
export async function waitToProve<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: WaitToProveParameters<chain, chainOverride>,
): Promise<WaitToProveReturnType> {
  const { receipt } = parameters

  const [message] = getWithdrawalMessages(receipt)

  const output = await waitForL2Output(client, {
    ...parameters,
    l2BlockNumber: receipt.blockNumber,
  })

  return { message, output }
}