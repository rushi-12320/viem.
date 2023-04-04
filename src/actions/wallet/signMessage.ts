import type { Transport, WalletClient } from '../../clients'
import { AccountNotFoundError } from '../../errors'
import type { Account, Chain, GetAccountParameter, Hex } from '../../types'
import { parseAccount, toHex } from '../../utils'

export type SignMessageParameters<
  TAccount extends Account | undefined = Account | undefined,
> = GetAccountParameter<TAccount> & {
  message: string
}

export type SignMessageReturnType = Hex

export async function signMessage<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: WalletClient<Transport, TChain, TAccount>,
  {
    account: account_ = client.account,
    message,
  }: SignMessageParameters<TAccount>,
): Promise<SignMessageReturnType> {
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/signMessage',
    })
  const account = parseAccount(account_)
  if (account.type === 'local') return account.signMessage({ message })
  return client.request({
    method: 'personal_sign',
    params: [toHex(message), account.address],
  })
}
