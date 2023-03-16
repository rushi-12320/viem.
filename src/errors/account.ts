import { BaseError } from './base'

export class AccountNotFoundError extends BaseError {
  name = 'AccountNotFoundError'
  constructor({ docsPath }: { docsPath?: string } = {}) {
    super(
      [
        'Could not find an Account to execute with this Action.',
        'Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the WalletClient.',
      ].join('\n'),
      {
        docsPath,
        docsSlug: 'account',
      },
    )
  }
}
