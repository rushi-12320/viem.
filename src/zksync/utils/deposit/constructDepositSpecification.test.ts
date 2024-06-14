import { afterAll, expect, test, vi } from 'vitest'
import { zkSyncClientLocalNodeWithAccountL1 } from '~test/src/zksync.js'
import { mockClientPublicActionsL2 } from '~test/src/zksyncPublicActionsL2MockData.js'
import { ethAddressInContracts } from '~viem/zksync/constants/address.js'
import * as readContract from '../../../actions/public/readContract.js'
import { constructDepositSpecification } from './constructDepositSpecification.js'

const client = { ...zkSyncClientLocalNodeWithAccountL1 }

mockClientPublicActionsL2(client)

const spy = vi.spyOn(readContract, 'readContract').mockResolvedValue('0x123')

afterAll(() => {
  spy.mockRestore()
})

test('getBaseCostFromFeeData', async () => {
  const depositSpecification = await constructDepositSpecification(client, {
    amount: 100n,
    token: ethAddressInContracts,
  })
  expect(depositSpecification).toMatchInlineSnapshot(`
    {
      "amount": 100n,
      "approveBaseOverrides": {},
      "approveOverrides": {},
      "eRC20DefaultBridgeData": "0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000054574686572000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003455448000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012",
      "fees": {
        "maxFeePerGas": 120000000n,
        "maxPriorityFeePerGas": 0n,
      },
      "token": "0x0000000000000000000000000000000000000001",
    }
  `)
})
