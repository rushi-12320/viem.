import type { Account } from '../../../accounts/types.js'
import { parseAccount } from '../../../accounts/utils/parseAccount.js'
import { sendTransaction as sendTransactionOriginal } from '../../../actions/index.js'
import { getChainId } from '../../../actions/public/getChainId.js'
import { sendRawTransaction } from '../../../actions/wallet/sendRawTransaction.js'
import type {
  SendTransactionParameters,
  SendTransactionReturnType,
} from '../../../actions/wallet/sendTransaction.js'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../../errors/account.js'
import { BaseError } from '../../../errors/base.js'
import type { Hash } from '../../../types/misc.js'
import { assertCurrentChain } from '../../../utils/chain/assertCurrentChain.js'
import {
  type GetTransactionErrorParameters,
  getTransactionError,
} from '../../../utils/errors/getTransactionError.js'
import { getAction } from '../../../utils/getAction.js'
import {
  type AssertRequestParameters,
  assertRequest,
} from '../../../utils/transaction/assertRequest.js'
import { type ChainEIP712, isEip712Transaction } from '../types.js'
import { prepareTransactionRequest } from './prepareTransactionRequest.js'
import { signTransaction } from './signTransaction.js'

export type {
  SendTransactionParameters,
  SendTransactionReturnType,
  SendTransactionErrorType,
} from '../../../actions/wallet/sendTransaction.js'

/**
 * Creates, signs, and sends a new transaction to the network.
 *
 * - Docs: https://viem.sh/docs/zksync/actions/sendTransaction
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
 *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { zkSync } from 'viem/chains'
 * import { sendTransaction } from 'viem/chains/zksync'
 *
 * const client = createWalletClient({
 *   chain: zkSync,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { zkSync } from 'viem/chains'
 * import { sendTransaction } from 'viem/chains/zksync'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: zkSync,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
export async function sendTransaction<
  TChain extends ChainEIP712 | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends ChainEIP712 | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  argsIncoming: SendTransactionParameters<TChain, TAccount, TChainOverride>,
): Promise<SendTransactionReturnType> {
  const args = {
    ...argsIncoming,
    chain: argsIncoming.chain || client.chain,
    account: argsIncoming.account || client.account,
  }

  if (!args.account)
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/sendTransaction',
    })
  const account = parseAccount(args.account)

  try {
    assertRequest(argsIncoming as AssertRequestParameters)

    let chainId = await getAction(client, getChainId, 'getChainId')({})
    if (args.chain !== null) {
      assertCurrentChain({
        currentChainId: chainId,
        chain: args.chain,
      })
    }

    if (
      client.chain?.custom?.eip712domain?.eip712domain &&
      isEip712Transaction({ ...args, chainId })
    ) {
      const eip712domain = client.chain?.custom.eip712domain?.eip712domain

      if (eip712domain === undefined)
        throw new BaseError("Chain doesn't define EIP712 domain.")

      // Prepare the request for signing (assign appropriate fees, etc.)
      const request = await prepareTransactionRequest(client, {
        ...args,
        chain: undefined,
      } as any)

      if (!chainId)
        chainId = await getAction(client, getChainId, 'getChainId')({})

      // EIP712 sign will be done inside the signTransaction
      const serializedTransaction = (await signTransaction(client, {
        ...request,
        chainId,
      } as any)) as Hash

      return await getAction(
        client,
        sendRawTransaction,
        'sendRawTransaction',
      )({
        serializedTransaction,
      })
    }

    return sendTransactionOriginal(
      client,
      argsIncoming as SendTransactionParameters,
    )
  } catch (err) {
    throw getTransactionError(err as BaseError, {
      ...(argsIncoming as GetTransactionErrorParameters),
      account,
      chain: argsIncoming.chain || undefined,
    })
  }
}
