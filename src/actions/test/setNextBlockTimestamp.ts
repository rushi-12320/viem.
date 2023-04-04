import type { TestClient, TestClientMode, Transport } from '../../clients'
import type { Chain } from '../../types'
import { numberToHex } from '../../utils'

export type SetNextBlockTimestampParameters = {
  /** The timestamp (in seconds). */
  timestamp: bigint
}

export async function setNextBlockTimestamp<TChain extends Chain | undefined>(
  client: TestClient<TestClientMode, Transport, TChain>,
  { timestamp }: SetNextBlockTimestampParameters,
) {
  return await client.request({
    method: 'evm_setNextBlockTimestamp',
    params: [numberToHex(timestamp)],
  })
}
