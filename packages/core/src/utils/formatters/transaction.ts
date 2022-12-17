import type { Chain, Formatter, Formatters } from '../../chains'
import type { RpcTransaction, Transaction } from '../../types'
import { transactionType } from '../../constants'
import { hexToNumber } from '../number'
import type { ExtractFormatter, Formatted } from './format'

export type TransactionFormatter<TChain extends Chain = Chain> =
  ExtractFormatter<
    TChain,
    'transaction',
    NonNullable<Formatters['transaction']>
  >

export type FormattedTransaction<
  TFormatter extends Formatter | undefined = Formatter,
> = Formatted<TFormatter, Transaction>

export function formatTransaction(transaction: Partial<RpcTransaction>) {
  const transaction_ = {
    ...transaction,
    blockNumber: transaction.blockNumber
      ? BigInt(transaction.blockNumber)
      : null,
    gas: transaction.gas ? BigInt(transaction.gas) : undefined,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
    maxFeePerGas: transaction.maxFeePerGas
      ? BigInt(transaction.maxFeePerGas)
      : undefined,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
      ? BigInt(transaction.maxPriorityFeePerGas)
      : undefined,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
    transactionIndex: transaction.transactionIndex
      ? Number(transaction.transactionIndex)
      : null,
    type: transaction.type ? transactionType[transaction.type] : undefined,
    value: transaction.value ? BigInt(transaction.value) : undefined,
    v: transaction.v ? BigInt(transaction.v) : undefined,
  }

  if (transaction_.type === 'legacy') {
    delete transaction_['accessList']
    delete transaction_['maxFeePerGas']
    delete transaction_['maxPriorityFeePerGas']
  }
  if (transaction_.type === 'eip2930') {
    delete transaction_['maxFeePerGas']
    delete transaction_['maxPriorityFeePerGas']
  }
  return transaction_ as Transaction
}
