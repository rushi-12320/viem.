import { getVersion } from './utils'

type BaseErrorArgs = {
  docsPath?: string
  metaMessages?: string[]
} & (
  | {
      cause?: never
      details?: string
    }
  | {
      cause: BaseError | Error
      details?: never
    }
)

export class BaseError extends Error {
  details: string
  docsPath?: string
  metaMessages?: string[]
  shortMessage: string

  name = 'ViemError'

  constructor(shortMessage: string, args: BaseErrorArgs = {}) {
    const details =
      args.cause instanceof BaseError
        ? args.cause.details
        : args.cause?.message
        ? args.cause.message
        : args.details!
    const docsPath =
      args.cause instanceof BaseError
        ? args.cause.docsPath || args.docsPath
        : args.docsPath
    const message = [
      shortMessage || 'An error occurred.',
      '',
      ...(args.metaMessages ? [...args.metaMessages, ''] : []),
      ...(docsPath ? [`Docs: https://viem.sh${docsPath}`] : []),
      ...(details ? [`Details: ${details}`] : []),
      `Version: ${getVersion()}`,
    ].join('\n')

    super(message)

    if (args.cause) this.cause = args.cause
    this.details = details
    this.docsPath = docsPath
    this.metaMessages = args.metaMessages
    this.shortMessage = shortMessage
  }
}
