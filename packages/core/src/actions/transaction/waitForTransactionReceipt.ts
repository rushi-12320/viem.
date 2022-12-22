import type { Chain } from '../../chains'
import type { PublicClient } from '../../clients'
import type { Data, Transaction } from '../../types'
import { BaseError } from '../../utils'
import { observe } from '../../utils/observe'
import { fetchBlock, watchBlockNumber } from '../block'
import type { FetchTransactionResponse } from './fetchTransaction'
import { TransactionNotFoundError, fetchTransaction } from './fetchTransaction'
import type { FetchTransactionReceiptResponse } from './fetchTransactionReceipt'
import {
  TransactionReceiptNotFoundError,
  fetchTransactionReceipt,
} from './fetchTransactionReceipt'

export type ReplacementReason = 'cancelled' | 'replaced' | 'repriced'
export type ReplacementResponse<TChain extends Chain = Chain> = {
  reason: ReplacementReason
  replacedTransaction: Transaction
  transaction: Transaction
  transactionReceipt: FetchTransactionReceiptResponse<TChain>
}

export type WaitForTransactionReceiptResponse<TChain extends Chain = Chain> =
  FetchTransactionReceiptResponse<TChain>

export type WaitForTransactionReceiptArgs<TChain extends Chain = Chain> = {
  /** The number of confirmations (blocks that have passed) to wait before resolving. */
  confirmations?: number
  /** The hash of the transaction. */
  hash: Data
  onReplaced?: (response: ReplacementResponse<TChain>) => void
  /** Polling frequency (in ms). Defaults to the client's pollingInterval config. */
  pollingInterval?: number
  /** Optional timeout (in milliseconds) to wait before stopping polling. */
  timeout?: number
}

export async function waitForTransactionReceipt<TChain extends Chain>(
  client: PublicClient<any, TChain>,
  {
    confirmations = 1,
    hash,
    onReplaced,
    pollingInterval = client.pollingInterval,
    timeout,
  }: WaitForTransactionReceiptArgs<TChain>,
): Promise<WaitForTransactionReceiptResponse<TChain>> {
  const observerId = JSON.stringify([
    'waitForTransactionReceipt',
    client.uid,
    hash,
  ])

  let transaction: FetchTransactionResponse<TChain> | undefined
  let replacedTransaction: FetchTransactionResponse<TChain> | undefined
  let receipt: FetchTransactionReceiptResponse<TChain>

  return new Promise((resolve, reject) => {
    if (timeout)
      setTimeout(
        () => reject(new WaitForTransactionReceiptTimeoutError({ hash })),
        timeout,
      )

    const unobserve = observe(observerId, { onReplaced, resolve, reject })(
      (emit) => {
        const unwatch = watchBlockNumber(client, {
          emitMissed: true,
          emitOnBegin: true,
          pollingInterval,
          async onBlockNumber(blockNumber) {
            const done = async (fn: () => void) => {
              unwatch()
              fn()
              unobserve()
            }

            try {
              // If we already have a valid receipt, let's check if we have enough
              // confirmations. If we do, then we can resolve.
              if (receipt) {
                if (blockNumber - receipt.blockNumber + 1n < confirmations)
                  return

                done(() => emit.resolve(receipt))
                return
              }

              // Fetch the transaction to check if it's been replaced.
              transaction = await fetchTransaction(client, { hash })

              // Fetch the receipt to check if it's been processed.
              receipt = await fetchTransactionReceipt(client, { hash })

              // Check if we have enough confirmations. If not, continue polling.
              if (blockNumber - receipt.blockNumber + 1n < confirmations) return

              done(() => emit.resolve(receipt))
            } catch (err) {
              // If the receipt is not found, the transaction will be pending.
              // We need to check if it has potentially been replaced.
              if (
                transaction &&
                (err instanceof TransactionNotFoundError ||
                  err instanceof TransactionReceiptNotFoundError)
              ) {
                replacedTransaction = transaction

                // Let's retrieve the transactions from the current block.
                const block = await fetchBlock(client, {
                  blockNumber,
                  includeTransactions: true,
                })

                const replacementTransaction = (
                  block.transactions as Transaction[]
                ).find(
                  ({ from, nonce }) =>
                    from === replacedTransaction!.from &&
                    nonce === replacedTransaction!.nonce,
                )

                // If we couldn't find a replacement transaction, continue polling.
                if (!replacementTransaction) return

                // If we found a replacement transaction, return it's receipt.
                receipt = await fetchTransactionReceipt(client, {
                  hash: replacementTransaction.hash,
                })

                // Check if we have enough confirmations. If not, continue polling.
                if (blockNumber - receipt.blockNumber + 1n < confirmations)
                  return

                let reason: ReplacementReason = 'replaced'
                if (
                  replacementTransaction.to === replacedTransaction.to &&
                  replacementTransaction.value === replacedTransaction.value
                ) {
                  reason = 'repriced'
                } else if (
                  replacementTransaction.from === replacementTransaction.to &&
                  replacementTransaction.value === 0n
                ) {
                  reason = 'cancelled'
                }

                done(() => {
                  emit.onReplaced?.({
                    reason,
                    replacedTransaction: replacedTransaction!,
                    transaction: replacementTransaction,
                    transactionReceipt: receipt,
                  })
                  emit.resolve(receipt)
                })
              } else {
                done(() => emit.reject(err))
              }
            }
          },
        })
        return unwatch
      },
    )
  })
}

export class WaitForTransactionReceiptTimeoutError extends BaseError {
  name = 'WaitForTransactionReceiptTimeoutError'
  constructor({ hash }: { hash: Data }) {
    super({
      humanMessage: `Timed out while waiting for transaction with hash "${hash}" to be confirmed.`,
      details: 'timeout waiting for confirmation.',
    })
  }
}
