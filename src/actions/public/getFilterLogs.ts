import type { Abi, AbiEvent } from 'abitype'
import type { PublicClient } from '../../clients'
import type { Filter, Log, MaybeAbiEventName } from '../../types'
import { decodeEventLog } from '../../utils'

import { formatLog } from '../../utils/formatters/log'

export type GetFilterLogsArgs<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbi extends Abi | readonly unknown[] = [TAbiEvent],
  TEventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = {
  filter: Filter<'event', TAbi, TEventName, any>
}
export type GetFilterLogsResponse<
  TAbiEvent extends AbiEvent | undefined = undefined,
  TAbi extends Abi | readonly unknown[] = [TAbiEvent],
  TEventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = Log<bigint, number, TAbiEvent, TAbi, TEventName>[]

export async function getFilterLogs<
  TAbiEvent extends AbiEvent | undefined,
  TAbi extends Abi | readonly unknown[],
  TEventName extends string | undefined,
>(
  client: PublicClient,
  { filter }: GetFilterLogsArgs<TAbiEvent, TAbi, TEventName>,
): Promise<GetFilterLogsResponse<TAbiEvent, TAbi, TEventName>> {
  const logs = await client.request({
    method: 'eth_getFilterLogs',
    params: [filter.id],
  })
  return logs.map((log) => {
    const { eventName, args } =
      'abi' in filter && filter.abi
        ? decodeEventLog({
            abi: filter.abi,
            data: log.data,
            topics: log.topics as any,
          })
        : { eventName: undefined, args: undefined }
    return formatLog(log, { args, eventName })
  }) as unknown as GetFilterLogsResponse<TAbiEvent, TAbi, TEventName>
}
