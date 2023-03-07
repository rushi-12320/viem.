import { Abi, AbiEvent } from 'abitype'
import type {
  CallParameters,
  CallReturnType,
  CreateBlockFilterReturnType,
  CreateContractEventFilterParameters,
  CreateContractEventFilterReturnType,
  CreateEventFilterParameters,
  CreateEventFilterReturnType,
  CreatePendingTransactionFilterReturnType,
  EstimateGasParameters,
  EstimateGasReturnType,
  EstimateContractGasParameters,
  EstimateContractGasReturnType,
  GetBalanceParameters,
  GetBalanceReturnType,
  GetBlockParameters,
  GetBlockNumberParameters,
  GetBlockNumberReturnType,
  GetBlockReturnType,
  GetBlockTransactionCountParameters,
  GetBlockTransactionCountReturnType,
  GetBytecodeParameters,
  GetBytecodeReturnType,
  GetChainIdReturnType,
  GetFeeHistoryParameters,
  GetFeeHistoryReturnType,
  GetFilterChangesParameters,
  GetFilterChangesReturnType,
  GetFilterLogsParameters,
  GetFilterLogsReturnType,
  GetGasPriceReturnType,
  GetTransactionParameters,
  GetTransactionConfirmationsParameters,
  GetTransactionConfirmationsReturnType,
  GetTransactionCountParameters,
  GetTransactionCountReturnType,
  GetTransactionReceiptParameters,
  GetTransactionReceiptReturnType,
  GetTransactionReturnType,
  UninstallFilterParameters,
  UninstallFilterReturnType,
  WaitForTransactionReceiptParameters,
  WaitForTransactionReceiptReturnType,
  WatchBlockNumberParameters,
  WatchBlocksParameters,
  WatchPendingTransactionsParameters,
  GetLogsParameters,
  GetLogsReturnType,
  GetStorageAtParameters,
  GetStorageAtReturnType,
  MulticallParameters,
  MulticallReturnType,
  ReadContractParameters,
  ReadContractReturnType,
  SimulateContractParameters,
  SimulateContractReturnType,
  WatchContractEventParameters,
  WatchEventParameters,
} from '../../actions/public'
import {
  call,
  createBlockFilter,
  createContractEventFilter,
  createEventFilter,
  createPendingTransactionFilter,
  estimateContractGas,
  estimateGas,
  getBalance,
  getBlock,
  getBlockNumber,
  getBlockTransactionCount,
  getBytecode,
  getChainId,
  getFeeHistory,
  getFilterChanges,
  getFilterLogs,
  getGasPrice,
  getLogs,
  getTransaction,
  getTransactionConfirmations,
  getTransactionCount,
  getTransactionReceipt,
  uninstallFilter,
  waitForTransactionReceipt,
  watchBlockNumber,
  watchBlocks,
  watchEvent,
  watchPendingTransactions,
  getStorageAt,
  multicall,
  readContract,
  simulateContract,
  watchContractEvent,
} from '../../actions/public'
import type {
  GetEnsAddressParameters,
  GetEnsAddressReturnType,
  GetEnsNameParameters,
  GetEnsNameReturnType,
} from '../../actions/ens'
import { getEnsAddress, getEnsName } from '../../actions/ens'
import type { PublicClient } from '../createPublicClient'
import {
  Chain,
  ContractConfig,
  FilterType,
  MaybeExtractEventArgsFromAbi,
} from '../../types'

export type PublicActions<TChain extends Chain = Chain> = {
  call: (args: CallParameters<TChain>) => Promise<CallReturnType>
  createBlockFilter: () => Promise<CreateBlockFilterReturnType>
  createContractEventFilter: <
    TAbi extends Abi | readonly unknown[],
    TEventName extends string | undefined,
    TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined,
  >(
    args: CreateContractEventFilterParameters<TAbi, TEventName, TArgs>,
  ) => Promise<CreateContractEventFilterReturnType<TAbi, TEventName, TArgs>>
  createEventFilter: <
    TAbiEvent extends AbiEvent | undefined,
    TAbi extends Abi | readonly unknown[],
    TEventName extends string | undefined,
    TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined,
  >(
    args?: CreateEventFilterParameters<TAbiEvent, TAbi, TEventName, TArgs>,
  ) => Promise<CreateEventFilterReturnType<TAbiEvent, TAbi, TEventName, TArgs>>
  createPendingTransactionFilter: () => Promise<CreatePendingTransactionFilterReturnType>
  estimateContractGas: <
    TChain extends Chain,
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends string,
  >(
    args: EstimateContractGasParameters<TChain, TAbi, TFunctionName>,
  ) => Promise<EstimateContractGasReturnType>
  estimateGas: (
    args: EstimateGasParameters<TChain>,
  ) => Promise<EstimateGasReturnType>
  getBalance: (args: GetBalanceParameters) => Promise<GetBalanceReturnType>
  getBlock: (args?: GetBlockParameters) => Promise<GetBlockReturnType<TChain>>
  getBlockNumber: (
    args?: GetBlockNumberParameters,
  ) => Promise<GetBlockNumberReturnType>
  getBlockTransactionCount: (
    args?: GetBlockTransactionCountParameters,
  ) => Promise<GetBlockTransactionCountReturnType>
  getBytecode: (args: GetBytecodeParameters) => Promise<GetBytecodeReturnType>
  getChainId: () => Promise<GetChainIdReturnType>
  getEnsAddress: (
    args: GetEnsAddressParameters,
  ) => Promise<GetEnsAddressReturnType>
  getEnsName: (args: GetEnsNameParameters) => Promise<GetEnsNameReturnType>
  getFeeHistory: (
    args: GetFeeHistoryParameters,
  ) => Promise<GetFeeHistoryReturnType>
  getFilterChanges: <
    TFilterType extends FilterType,
    TAbiEvent extends AbiEvent | undefined,
    TAbi extends Abi | readonly unknown[],
    TEventName extends string | undefined,
  >(
    args: GetFilterChangesParameters<TFilterType, TAbiEvent, TAbi, TEventName>,
  ) => Promise<
    GetFilterChangesReturnType<TFilterType, TAbiEvent, TAbi, TEventName>
  >
  getFilterLogs: <
    TAbiEvent extends AbiEvent | undefined,
    TAbi extends Abi | readonly unknown[],
    TEventName extends string | undefined,
  >(
    args: GetFilterLogsParameters<TAbiEvent, TAbi, TEventName>,
  ) => Promise<GetFilterLogsReturnType<TAbiEvent, TAbi, TEventName>>
  getGasPrice: () => Promise<GetGasPriceReturnType>
  getLogs: <TAbiEvent extends AbiEvent | undefined>(
    args?: GetLogsParameters<TAbiEvent>,
  ) => Promise<GetLogsReturnType<TAbiEvent>>
  getStorageAt: (
    args: GetStorageAtParameters,
  ) => Promise<GetStorageAtReturnType>
  getTransaction: (
    args: GetTransactionParameters,
  ) => Promise<GetTransactionReturnType<TChain>>
  getTransactionConfirmations: (
    args: GetTransactionConfirmationsParameters<TChain>,
  ) => Promise<GetTransactionConfirmationsReturnType>
  getTransactionCount: (
    args: GetTransactionCountParameters,
  ) => Promise<GetTransactionCountReturnType>
  getTransactionReceipt: (
    args: GetTransactionReceiptParameters,
  ) => Promise<GetTransactionReceiptReturnType<TChain>>
  multicall: <
    TContracts extends ContractConfig[],
    TAllowFailure extends boolean = true,
  >(
    args: MulticallParameters<TContracts, TAllowFailure>,
  ) => Promise<MulticallReturnType<TContracts, TAllowFailure>>
  readContract: <
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends string,
  >(
    args: ReadContractParameters<TAbi, TFunctionName>,
  ) => Promise<ReadContractReturnType<TAbi, TFunctionName>>
  simulateContract: <
    TAbi extends Abi | readonly unknown[] = Abi,
    TFunctionName extends string = any,
    TChainOverride extends Chain | undefined = undefined,
  >(
    args: SimulateContractParameters<
      TChain,
      TAbi,
      TFunctionName,
      TChainOverride
    >,
  ) => Promise<
    SimulateContractReturnType<
      TChainOverride extends Chain ? TChainOverride : TChain,
      TAbi,
      TFunctionName
    >
  >
  uninstallFilter: (
    args: UninstallFilterParameters,
  ) => Promise<UninstallFilterReturnType>
  waitForTransactionReceipt: (
    args: WaitForTransactionReceiptParameters<TChain>,
  ) => Promise<WaitForTransactionReceiptReturnType<TChain>>
  watchBlockNumber: (
    args: WatchBlockNumberParameters,
  ) => ReturnType<typeof watchBlockNumber>
  watchBlocks: (
    args: WatchBlocksParameters<TChain>,
  ) => ReturnType<typeof watchBlocks>
  watchContractEvent: <
    TAbi extends Abi | readonly unknown[],
    TEventName extends string,
  >(
    args: WatchContractEventParameters<TAbi, TEventName>,
  ) => ReturnType<typeof watchContractEvent>
  watchEvent: <
    TAbiEvent extends AbiEvent | undefined,
    TEventName extends string | undefined,
  >(
    args: WatchEventParameters<TAbiEvent>,
  ) => ReturnType<typeof watchEvent>
  watchPendingTransactions: (
    args: WatchPendingTransactionsParameters,
  ) => ReturnType<typeof watchPendingTransactions>
}

export const publicActions = <
  TChain extends Chain,
  TClient extends PublicClient<any, any>,
>(
  client: TClient,
): PublicActions<TChain> => ({
  call: (args) => call(client, args),
  createBlockFilter: () => createBlockFilter(client),
  createContractEventFilter: (args) => createContractEventFilter(client, args),
  createEventFilter: (args) => createEventFilter(client, args),
  createPendingTransactionFilter: () => createPendingTransactionFilter(client),
  estimateContractGas: (args) => estimateContractGas(client, args),
  estimateGas: (args) => estimateGas(client, args),
  getBalance: (args) => getBalance(client, args),
  getBlock: (args) => getBlock(client, args),
  getBlockNumber: (args) => getBlockNumber(client, args),
  getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
  getBytecode: (args) => getBytecode(client, args),
  getChainId: () => getChainId(client),
  getEnsAddress: (args) => getEnsAddress(client, args),
  getEnsName: (args) => getEnsName(client, args),
  getFeeHistory: (args) => getFeeHistory(client, args),
  getFilterChanges: (args) => getFilterChanges(client, args),
  getFilterLogs: (args) => getFilterLogs(client, args),
  getGasPrice: () => getGasPrice(client),
  getLogs: (args) => getLogs(client, args),
  getStorageAt: (args) => getStorageAt(client, args),
  getTransaction: (args) => getTransaction(client, args),
  getTransactionConfirmations: (args) =>
    getTransactionConfirmations(client, args),
  getTransactionCount: (args) => getTransactionCount(client, args),
  getTransactionReceipt: (args) => getTransactionReceipt(client, args),
  multicall: (args) => multicall(client, args),
  readContract: (args) => readContract(client, args),
  simulateContract: (args) => simulateContract(client, args),
  uninstallFilter: (args) => uninstallFilter(client, args),
  waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
  watchBlocks: (args) => watchBlocks(client, args),
  watchBlockNumber: (args) => watchBlockNumber(client, args),
  watchContractEvent: (args) => watchContractEvent(client, args),
  watchEvent: (args) => watchEvent(client, args),
  watchPendingTransactions: (args) => watchPendingTransactions(client, args),
})
