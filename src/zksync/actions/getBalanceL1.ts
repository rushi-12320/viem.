import type { Address } from '../../accounts/index.js'
import { getBalance } from '../../actions/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { AccountNotFoundError } from '../../errors/account.js'
import type { BaseError } from '../../errors/base.js'
import type { Account, GetAccountParameter } from '../../types/account.js'
import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { IsUndefined } from '../../types/utils.js'
import { parseAccount } from '../../utils/index.js'
import { legacyEthAddress } from '../constants/address.js'
import { isEth } from '../utils/isEth.js'
import {
  type BalanceOfTokenL1Parameters,
  getBalanceOfTokenL1,
} from './getBalanceOfTokenL1.js'

export type BalanceL1Parameters<
  TAccount extends Account | undefined = Account | undefined,
  TToken extends Address | undefined = Address | undefined,
  TRequired extends boolean = false,
> = GetAccountParameter<TAccount> &
  (IsUndefined<TToken> extends true
    ? TRequired extends false
      ? { token?: TToken | Address }
      : { token: TToken | Address }
    : { token?: TToken | Address }) & {
    blockTag?: BlockTag | undefined
  }

export type BalanceL1ReturnType = bigint

export type BalanceL1ErrorType = AccountNotFoundError | BaseError

export async function getBalanceL1<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TToken extends Address | undefined = Address | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: BalanceL1Parameters<TAccount, TToken, false>,
): Promise<bigint> {
  const {
    token: token_,
    blockTag,
    account: account_,
  } = parameters as BalanceL1Parameters<TAccount>

  const account = account_ ? parseAccount(account_) : client.account
  const token = token_ ?? legacyEthAddress

  if (isEth(token)) {
    return await getBalance(client, {
      address: account!.address,
      blockTag: blockTag,
    })
  }

  return await getBalanceOfTokenL1(client, {
    ...(parameters as BalanceOfTokenL1Parameters<TAccount, TToken, true>),
  })
}
