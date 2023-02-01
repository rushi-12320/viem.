import {
  Abi,
  AbiParameter,
  AbiParameterToPrimitiveType,
  ExtractAbiEventNames,
} from 'abitype'

import {
  AbiEventNotFoundError,
  FilterTypeNotSupportedError,
} from '../../errors'
import { ExtractEventArgsFromAbi, Hex } from '../../types'
import { encodeBytes } from '../encoding'
import { keccak256, getEventSignature } from '../hash'
import { encodeAbi } from './encodeAbi'
import { formatAbiItemWithParams } from './formatAbiItemWithParams'
import { getAbiItem } from './getAbiItem'

export type EncodeEventTopicsArgs<
  TAbi extends Abi = Abi,
  TEventName extends ExtractAbiEventNames<TAbi> = any,
> = {
  abi: TAbi
  eventName: TEventName
} & ExtractEventArgsFromAbi<TAbi, TEventName>

export function encodeEventTopics<
  TAbi extends Abi = Abi,
  TEventName extends ExtractAbiEventNames<TAbi> = any,
>({ abi, eventName, args }: EncodeEventTopicsArgs<TAbi, TEventName>) {
  const abiItem = getAbiItem({ abi, name: eventName })
  if (!abiItem)
    throw new AbiEventNotFoundError(eventName, {
      docsPath: '/docs/contract/encodeEventTopics',
    })
  const definition = formatAbiItemWithParams(abiItem)
  const signature = getEventSignature(definition as `${string}(${string})`)

  let topics: Hex[] = []
  if (args && 'inputs' in abiItem) {
    const args_ = Array.isArray(args)
      ? args
      : abiItem.inputs?.map((x: any) => (args as any)[x.name]) ?? []
    topics =
      abiItem.inputs
        ?.filter((param) => 'indexed' in param && param.indexed)
        .map((param, i) =>
          Array.isArray(args_[i])
            ? args_[i].map((_: any, j: number) =>
                encodeArg({ param, value: args_[i][j] }),
              )
            : args_[i]
            ? encodeArg({ param, value: args_[i] })
            : null,
        ) ?? []
  }
  return [signature, ...topics]
}

function encodeArg({
  param,
  value,
}: { param: AbiParameter; value: AbiParameterToPrimitiveType<AbiParameter> }) {
  if (param.type === 'string' || param.type === 'bytes')
    return keccak256(encodeBytes(value as string))
  if (param.type === 'tuple' || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type)
  return encodeAbi({ params: [param], values: [value] })
}
