import type { Address } from 'abitype'
import {
  type WriteContractErrorType,
  writeContract,
} from '../../../actions/wallet/writeContract.js'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import { zeroAddress } from '../../../constants/address.js'
import type { ErrorType } from '../../../errors/utils.js'
import type { Account, GetAccountParameter } from '../../../types/account.js'
import type {
  Chain,
  DeriveChain,
  GetChainParameter,
} from '../../../types/chain.js'
import type { Hash, Hex } from '../../../types/misc.js'
import type { UnionEvaluate, UnionOmit } from '../../../types/utils.js'
import type { FormattedTransactionRequest } from '../../../utils/formatters/transactionRequest.js'
import { portalAbi } from '../abis.js'
import type { GetContractAddressParameter } from '../types/contract.js'

export type DepositTransactionParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  _derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = UnionEvaluate<
  UnionOmit<
    FormattedTransactionRequest<_derivedChain>,
    | 'accessList'
    | 'data'
    | 'from'
    | 'gas'
    | 'gasPrice'
    | 'to'
    | 'type'
    | 'value'
  >
> &
  GetAccountParameter<account, Account | Address> &
  GetChainParameter<chain, chainOverride> &
  GetContractAddressParameter<_derivedChain, 'portal'> & {
    /** Arguments supplied to the L2 transaction. */
    args: {
      /** Gas limit for transaction execution on the L2. */
      gas: bigint
      /** Value in wei to mint (deposit) on the L2. Debited from the caller's L1 balance. */
      mint?: bigint
      /** Value in wei sent with this transaction on the L2. Debited from the caller's L2 balance. */
      value?: bigint
    } & (
      | {
          /** Encoded contract method & arguments. */
          data?: Hex
          /** Whether or not this is a contract deployment transaction. */
          isCreation?: false
          /** L2 Transaction recipient. */
          to?: Address
        }
      | {
          /** Contract deployment bytecode. Required for contract deployment transactions. */
          data: Hex
          /** Whether or not this is a contract deployment transaction. */
          isCreation: true
          /** L2 Transaction recipient. Cannot exist for contract deployment transactions. */
          to?: never
        }
    )
  }
export type DepositTransactionReturnType = Hash
export type DepositTransactionErrorType = WriteContractErrorType | ErrorType

/**
 * Initiates a [deposit transaction](https://github.com/ethereum-optimism/optimism/blob/develop/specs/deposits.md) on an L1, which executes a transaction on L2.
 *
 * Internally performs a contract write to the [`depositTransaction` function](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L1/OptimismPortal.sol#L378)
 * on the [Optimism Portal contract](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L1/OptimismPortal.sol).
 *
 * - Docs: https://viem.sh/op-stack/actions/depositTransaction.html
 *
 * @param client - Client to use
 * @param parameters - {@link DepositTransactionParameters}
 * @returns The L1 transaction hash. {@link DepositTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom, parseEther } from 'viem'
 * import { base, mainnet } from 'viem/chains'
 * import { walletActionsL1 } from 'viem/op-stack'
 * import { depositTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * }).extend(walletActionsL1())
 *
 * const hash = await depositTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   args: {
 *     gas: 21_000n,
 *     to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *     value: parseEther('1'),
 *   },
 *   targetChain: base,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { base, mainnet } from 'viem/chains'
 * import { walletActionsL1 } from 'viem/op-stack'
 * import { depositTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * }).extend(walletActionsL1())
 *
 * const hash = await depositTransaction(client, {
 *   args: {
 *     gas: 21_000n,
 *     to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *     value: parseEther('1'),
 *   },
 *   targetChain: base,
 * })
 */
export function depositTransaction<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: DepositTransactionParameters<chain, account, chainOverride>,
) {
  const {
    account,
    args: { data = '0x', gas, isCreation = false, mint, to = '0x', value },
    chain = client.chain,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    targetChain,
  } = parameters

  const portalAddress = (() => {
    if (parameters.portalAddress) return parameters.portalAddress
    if (chain) return targetChain!.contracts.portal[chain.id].address
    return Object.values(targetChain!.contracts.portal)[0].address
  })()

  return writeContract(client, {
    account,
    abi: portalAbi,
    address: portalAddress,
    chain,
    functionName: 'depositTransaction',
    args: [
      isCreation ? zeroAddress : to,
      value ?? mint ?? 0n,
      gas,
      isCreation,
      data,
    ],
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    value: mint,
  } as any)
}
