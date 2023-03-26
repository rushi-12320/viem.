import type { PublicClient, Transport } from '../../clients'
import type { Chain, Filter } from '../../types'

export type UninstallFilterParameters = {
  filter: Filter<any>
}
export type UninstallFilterReturnType = boolean

export async function uninstallFilter<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  { filter }: UninstallFilterParameters,
): Promise<UninstallFilterReturnType> {
  return client.request({
    method: 'eth_uninstallFilter',
    params: [filter.id],
  })
}
