import type { Address } from 'abitype'

import type { Transport, WalletClient } from '../../clients'
import type { Account, Chain } from '../../types'
import { checksumAddress } from '../../utils/address'

export type GetAddressesReturnType = Address[]

export async function getAddresses<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined = undefined,
>(
  client: WalletClient<Transport, TChain, TAccount>,
): Promise<GetAddressesReturnType> {
  const addresses = await client.request({ method: 'eth_accounts' })
  return addresses.map((address) => checksumAddress(address))
}
