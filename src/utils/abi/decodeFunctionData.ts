import { Abi } from 'abitype'

import { AbiFunctionSignatureNotFoundError } from '../../errors'
import { Hex } from '../../types'
import { slice } from '../data'
import { getFunctionSelector } from '../hash'
import { decodeAbiParameters } from './decodeAbiParameters'
import { formatAbiItem } from './formatAbiItem'

export type DecodeFunctionDataArgs = {
  abi: Abi | readonly unknown[]
  data: Hex
}

export function decodeFunctionData({ abi, data }: DecodeFunctionDataArgs) {
  const signature = slice(data, 0, 4)
  const description = (abi as Abi).find(
    (x) => signature === getFunctionSelector(formatAbiItem(x)),
  )
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: '/docs/contract/decodeFunctionData',
    })
  return {
    functionName: (description as { name: string }).name,
    args: ('inputs' in description &&
    description.inputs &&
    description.inputs.length > 0
      ? decodeAbiParameters(description.inputs, slice(data, 4))
      : undefined) as readonly unknown[] | undefined,
  }
}
