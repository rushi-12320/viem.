import type { TestClient } from '../../clients/index.js'
import { numberToHex } from '../../utils/index.js'

export type SetBlockGasLimitParameters = {
  /** Gas limit (in wei). */
  gasLimit: bigint
}

export async function setBlockGasLimit(
  client: TestClient,
  { gasLimit }: SetBlockGasLimitParameters,
) {
  return await client.request({
    method: 'evm_setBlockGasLimit',
    params: [numberToHex(gasLimit)],
  })
}
