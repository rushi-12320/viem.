import type { Chain } from '../types'
import { BaseError } from './base'

export class ChainDoesNotSupportContract extends BaseError {
  name = 'ChainDoesNotSupportContract'
  constructor({
    blockNumber,
    chain,
    contract,
  }: {
    blockNumber?: bigint
    chain: Chain
    contract: { name: string; blockCreated?: number }
  }) {
    super(
      `Chain "${chain.name}" does not support contract "${contract.name}".`,
      {
        metaMessages: [
          'This could be due to any of the following:',
          ...(blockNumber &&
          contract.blockCreated &&
          contract.blockCreated > blockNumber
            ? [
                `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`,
              ]
            : [
                `- The chain does not have the contract "${contract.name}" configured.`,
              ]),
        ],
      },
    )
  }
}

export class ChainMismatchError extends BaseError {
  name = 'ChainMismatchError'

  constructor({
    chain,
    currentChainId,
  }: { chain: Chain; currentChainId: number }) {
    super(
      `The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`,
      {
        metaMessages: [
          `Current Chain ID:  ${currentChainId}`,
          `Expected Chain ID: ${chain.id} – ${chain.name}`,
        ],
      },
    )
  }
}
