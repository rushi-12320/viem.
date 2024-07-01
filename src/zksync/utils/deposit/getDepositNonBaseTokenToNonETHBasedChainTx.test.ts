import { expect, test } from 'vitest'
import { mockDepositTransactionExtended } from '~test/src/zksync.js'
import { getDepositNonBaseTokenToNonEthBasedChainTx } from './getDepositNonBaseTokenToNonETHBasedChainTx.js'

test('getDepositNonBaseTokenToNonETHBasedChainTx', async () => {
  const depositEthToEthTx = await getDepositNonBaseTokenToNonEthBasedChainTx({
    ...mockDepositTransactionExtended,
    baseCost: 22222n,
    fees: {
      maxFeePerGas: 15000000100n,
      maxPriorityFeePerGas: 150000000000n,
    },
  })
  expect(depositEthToEthTx).toMatchInlineSnapshot(`
    {
      "amount": 5n,
      "approveBaseOverrides": {},
      "approveERC20": true,
      "approveOverrides": {},
      "baseCost": 22222n,
      "bridgeAddresses": {
        "erc20L1": "0x36f0f627400fd4b688048dcc03b400323e2e0122",
        "sharedL1": "0x85a70c1ea10e1e0aefdbf4dc846c022e160a3b30",
        "sharedL2": "0x76b389fdc2234afc8be046a75c39f555e0d2ce50",
      },
      "bridgehubContractAddress": "0x3c150b7a52cc2ede5fbf7bf7a2e1746776ffef21",
      "calldata": "0x",
      "contractAddress": "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
      "eRC20DefaultBridgeData": "0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003444149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012",
      "fees": {
        "maxFeePerGas": 15000000100n,
        "maxPriorityFeePerGas": 150000000000n,
      },
      "gasPerPubdataByte": 800n,
      "l2ChainId": 270n,
      "l2GasLimit": 233554123n,
      "l2Value": 0n,
      "mintValue": 22222n,
      "operatorTip": 0n,
      "overrides": {
        "from": "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
        "gasLimit": 223323223n,
        "maxFeePerGas": 15000000100n,
        "maxPriorityFeePerGas": 150000000000n,
        "value": 0n,
      },
      "refundRecipient": "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
      "secondBridgeEncodeData": {
        "amount": 5n,
        "secondBridgeValue": 0n,
        "to": "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
        "token": "0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55",
      },
      "to": "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
      "token": "0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55",
      "txValue": 0n,
    }
  `)
})
