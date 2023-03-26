import type { Transport, WalletClient } from '../../clients'
import { AccountNotFoundError } from '../../errors'
import type { Account, Chain, GetAccountParameter, Hex } from '../../types'
import { parseAccount, toHex } from '../../utils'

export type SignMessageParameters<
  TAccount extends Account | undefined = Account | undefined,
> = GetAccountParameter<TAccount> &
  (
    | {
        /** @deprecated – `data` will be removed in 0.2.0; use `message` instead. */
        data: string
        message?: never
      }
    | {
        data?: never
        message: string
      }
  )

export type SignMessageReturnType = Hex

export async function signMessage<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: WalletClient<Transport, TChain, TAccount>,
  {
    account: account_ = client.account,
    data,
    message,
  }: SignMessageParameters<TAccount>,
): Promise<SignMessageReturnType> {
  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/docs/actions/wallet/signMessage',
    })
  const account = parseAccount(account_)
  const message_ = message || data
  if (account.type === 'local')
    return account.signMessage({ message: message_! })
  return client.request({
    method: 'personal_sign',
    params: [toHex(message_!), account.address],
  })
}
