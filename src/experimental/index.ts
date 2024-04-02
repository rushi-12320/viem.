export {
  type GetCapabilitiesErrorType,
  type GetCapabilitiesReturnType,
  getCapabilities,
} from './actions/getCapabilities.js'
export {
  type SendCallsErrorType,
  type SendCallsParameters,
  type SendCallsReturnType,
  sendCalls,
} from './actions/sendCalls.js'
export {
  type GetCallsStatusErrorType,
  type GetCallsStatusParameters,
  type GetCallsStatusReturnType,
  getCallsStatus,
} from './actions/getCallsStatus.js'

export {
  type WalletActionsEip5792,
  walletActionsEip5792,
} from './decorators/eip5792.js'
