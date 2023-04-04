import type { PublicClient, Transport, WalletClient } from '../../clients'
import type { Account, Chain } from '../../types'
import { hexToNumber } from '../../utils'

export type GetChainIdReturnType = number

export async function getChainId<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client:
    | PublicClient<Transport, TChain>
    | WalletClient<Transport, TChain, TAccount>,
): Promise<GetChainIdReturnType> {
  const chainIdHex = await client.request({ method: 'eth_chainId' })
  return hexToNumber(chainIdHex)
}
