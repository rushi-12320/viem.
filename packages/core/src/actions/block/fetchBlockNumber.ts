import type { PublicClient } from '../../clients'

export type FetchBlockNumberResponse = bigint

export async function fetchBlockNumber(
  rpc: PublicClient,
): Promise<FetchBlockNumberResponse> {
  const blockNumber = await rpc.request({
    method: 'eth_blockNumber',
  })
  return BigInt(blockNumber)
}
