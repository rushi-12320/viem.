import { assertType, beforeAll, describe, expect, test } from 'vitest'

import { usdcContractConfig } from '../../_test/abis.js'
import { accounts, address, forkBlockNumber } from '../../_test/constants.js'
import { erc20InvalidTransferEventABI } from '../../_test/generated.js'
import {
  deployErc20InvalidTransferEvent,
  publicClient,
  testClient,
  walletClient,
} from '../../_test/utils.js'
import type { Log } from '../../types/log.js'
import { getAddress } from '../../utils/address/getAddress.js'
import { impersonateAccount } from '../test/impersonateAccount.js'
import { mine } from '../test/mine.js'
import { setBalance } from '../test/setBalance.js'
import { setIntervalMining } from '../test/setIntervalMining.js'
import { stopImpersonatingAccount } from '../test/stopImpersonatingAccount.js'
import { writeContract } from '../wallet/writeContract.js'

import { createContractEventFilter } from './createContractEventFilter.js'
import { createEventFilter } from './createEventFilter.js'
import { getFilterLogs } from './getFilterLogs.js'

const event = {
  default: {
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  invalid: {
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  unnamed: {
    inputs: [
      {
        indexed: true,
        type: 'address',
      },
      {
        indexed: true,
        type: 'address',
      },
      {
        indexed: false,
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
} as const

beforeAll(async () => {
  await setIntervalMining(testClient, { interval: 0 })
  await impersonateAccount(testClient, {
    address: address.vitalik,
  })
  await impersonateAccount(testClient, {
    address: address.usdcHolder,
  })
  await setBalance(testClient, {
    address: address.usdcHolder,
    value: 10000000000000000000000n,
  })

  return async () => {
    await stopImpersonatingAccount(testClient, {
      address: address.vitalik,
    })
    await stopImpersonatingAccount(testClient, {
      address: address.usdcHolder,
    })
  }
})

test('default', async () => {
  await mine(testClient, { blocks: 1 })
  const filter = await createEventFilter(publicClient)
  expect(await getFilterLogs(publicClient, { filter })).toMatchInlineSnapshot(
    '[]',
  )
})

describe('contract events', () => {
  test('no args', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, {
      filter,
    })

    assertType<Log<bigint, number, undefined, typeof usdcContractConfig.abi>[]>(
      logs,
    )
    expect(logs.length).toBe(3)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(logs[1].eventName).toEqual('Transfer')
    expect(logs[2].args).toEqual({
      owner: getAddress(address.vitalik),
      spender: getAddress(address.vitalik),
      value: 1n,
    })
    expect(logs[2].eventName).toEqual('Approval')
  })

  test('args: eventName', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
      eventName: 'Transfer',
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<
      Log<
        bigint,
        number,
        undefined,
        typeof usdcContractConfig.abi,
        'Transfer'
      >[]
    >(logs)
    expect(logs.length).toBe(2)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(logs[1].eventName).toEqual('Transfer')
  })

  test('args: fromBlock/toBlock', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
      eventName: 'Transfer',
      fromBlock: forkBlockNumber - 5n,
      toBlock: forkBlockNumber,
    })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<
      Log<
        bigint,
        number,
        undefined,
        typeof usdcContractConfig.abi,
        'Transfer'
      >[]
    >(logs)
    expect(logs.length).toBe(1056)
  })

  test('args: singular `from`', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
      eventName: 'Transfer',
      args: {
        from: address.vitalik,
      },
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<
      Log<
        bigint,
        number,
        undefined,
        typeof usdcContractConfig.abi,
        'Transfer'
      >[]
    >(logs)
    expect(logs.length).toBe(1)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
  })

  test('args: multiple `from`', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
      eventName: 'Transfer',
      args: {
        from: [address.vitalik, address.usdcHolder],
      },
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<
      Log<
        bigint,
        number,
        undefined,
        typeof usdcContractConfig.abi,
        'Transfer'
      >[]
    >(logs)
    expect(logs.length).toBe(2)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(logs[1].eventName).toEqual('Transfer')
  })

  test('args: singular `to`', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
      eventName: 'Transfer',
      args: {
        to: accounts[0].address,
      },
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<
      Log<
        bigint,
        number,
        undefined,
        typeof usdcContractConfig.abi,
        'Transfer'
      >[]
    >(logs)
    expect(logs.length).toBe(1)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
  })

  test('args: multiple `to`', async () => {
    const filter = await createContractEventFilter(publicClient, {
      abi: usdcContractConfig.abi,
      eventName: 'Transfer',
      args: {
        to: [accounts[0].address, accounts[1].address],
      },
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<
      Log<
        bigint,
        number,
        undefined,
        typeof usdcContractConfig.abi,
        'Transfer'
      >[]
    >(logs)
    expect(logs.length).toBe(2)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(logs[1].eventName).toEqual('Transfer')
  })
})

describe('raw events', () => {
  test('no args', async () => {
    const filter = await createEventFilter(publicClient)

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.usdcHolder,
    })

    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<Log[]>(logs)
    expect(logs.length).toBe(2)
  })

  test('args: event', async () => {
    const filter = await createEventFilter(publicClient, {
      event: event.default,
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.vitalik,
    })

    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<Log<bigint, number, typeof event.default>[]>(logs)
    expect(logs.length).toBe(2)
    expect(logs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[0].address),
      value: 1n,
    })
    expect(logs[0].eventName).toEqual('Transfer')
    expect(logs[1].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(logs[1].eventName).toEqual('Transfer')
  })

  test('args: fromBlock/toBlock', async () => {
    const filter = await createEventFilter(publicClient, {
      event: event.default,
      fromBlock: forkBlockNumber - 5n,
      toBlock: forkBlockNumber,
    })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<Log<bigint, number, typeof event.default>[]>(logs)
    expect(logs.length).toBe(1056)
  })

  test('args: singular `from`', async () => {
    const namedFilter = await createEventFilter(publicClient, {
      event: event.default,
      args: {
        from: address.vitalik,
      },
    })
    const unnamedFilter = await createEventFilter(publicClient, {
      event: event.unnamed,
      args: [address.vitalik],
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.usdcHolder,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const namedLogs = await getFilterLogs(publicClient, { filter: namedFilter })
    expect(namedLogs.length).toBe(2)
    expect(namedLogs[0].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(namedLogs[0].eventName).toEqual('Transfer')
    expect(namedLogs[1].args).toEqual({
      from: getAddress(address.vitalik),
      to: getAddress(accounts[1].address),
      value: 1n,
    })
    expect(namedLogs[1].eventName).toEqual('Transfer')

    const unnamedLogs = await getFilterLogs(publicClient, {
      filter: unnamedFilter,
    })
    expect(unnamedLogs.length).toBe(2)
    expect(unnamedLogs.length).toBe(2)
    expect(unnamedLogs[0].args).toEqual([
      getAddress(address.vitalik),
      getAddress(accounts[1].address),
      1n,
    ])
    expect(unnamedLogs[0].eventName).toEqual('Transfer')
    expect(unnamedLogs[1].args).toEqual([
      getAddress(address.vitalik),
      getAddress(accounts[1].address),
      1n,
    ])
    expect(unnamedLogs[1].eventName).toEqual('Transfer')
  })

  test('args: multiple `from`', async () => {
    const namedFilter = await createEventFilter(publicClient, {
      event: event.default,
      args: {
        from: [address.usdcHolder, address.vitalik],
      },
    })
    const unnamedFilter = await createEventFilter(publicClient, {
      event: event.unnamed,
      args: [[address.usdcHolder, address.vitalik]],
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.usdcHolder,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const namedLogs = await getFilterLogs(publicClient, { filter: namedFilter })
    expect(namedLogs.length).toBe(3)
    expect(namedLogs[0].eventName).toEqual('Transfer')
    expect(namedLogs[0].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[0].address),
      value: 1n,
    })

    const unnamedLogs = await getFilterLogs(publicClient, {
      filter: unnamedFilter,
    })
    expect(unnamedLogs.length).toBe(3)
    expect(unnamedLogs[0].eventName).toEqual('Transfer')
    expect(unnamedLogs[0].args).toEqual([
      getAddress(address.usdcHolder),
      getAddress(accounts[0].address),
      1n,
    ])
  })

  test('args: singular `to`', async () => {
    const namedFilter = await createEventFilter(publicClient, {
      event: event.default,
      args: {
        to: accounts[0].address,
      },
    })
    const unnamedFilter = await createEventFilter(publicClient, {
      event: event.unnamed,
      args: [null, accounts[0].address],
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.usdcHolder,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const namedLogs = await getFilterLogs(publicClient, { filter: namedFilter })
    expect(namedLogs.length).toBe(1)
    expect(namedLogs[0].eventName).toEqual('Transfer')
    expect(namedLogs[0].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[0].address),
      value: 1n,
    })

    const unnamedLogs = await getFilterLogs(publicClient, {
      filter: unnamedFilter,
    })
    expect(unnamedLogs.length).toBe(1)
    expect(unnamedLogs[0].eventName).toEqual('Transfer')
    expect(unnamedLogs[0].args).toEqual([
      getAddress(address.usdcHolder),
      getAddress(accounts[0].address),
      1n,
    ])
  })

  test('args: multiple `to`', async () => {
    const namedFilter = await createEventFilter(publicClient, {
      event: event.default,
      args: {
        to: [accounts[0].address, accounts[1].address],
      },
    })
    const unnamedFilter = await createEventFilter(publicClient, {
      event: event.unnamed,
      args: [null, [accounts[0].address, accounts[1].address]],
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.usdcHolder,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
    })
    await writeContract(walletClient, {
      ...usdcContractConfig,
      account: address.vitalik,
      functionName: 'approve',
      args: [address.vitalik, 1n],
    })
    await mine(testClient, { blocks: 1 })

    const namedLogs = await getFilterLogs(publicClient, { filter: namedFilter })
    expect(namedLogs.length).toBe(3)
    expect(namedLogs[0].eventName).toEqual('Transfer')
    expect(namedLogs[0].args).toEqual({
      from: getAddress(address.usdcHolder),
      to: getAddress(accounts[0].address),
      value: 1n,
    })

    const unnamedLogs = await getFilterLogs(publicClient, {
      filter: unnamedFilter,
    })
    expect(unnamedLogs.length).toBe(3)
    expect(unnamedLogs[0].eventName).toEqual('Transfer')
    expect(unnamedLogs[0].args).toEqual([
      getAddress(address.usdcHolder),
      getAddress(accounts[0].address),
      1n,
    ])
  })
})

describe('skip invalid logs', () => {
  test('indexed params mismatch', async () => {
    const { contractAddress } = await deployErc20InvalidTransferEvent()

    const filter = await createEventFilter(publicClient, {
      event: event.default,
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      abi: erc20InvalidTransferEventABI,
      address: contractAddress!,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      abi: erc20InvalidTransferEventABI,
      address: contractAddress!,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.vitalik,
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<Log[]>(logs)
    expect(logs.length).toBe(1)
  })

  test('non-indexed params mismatch', async () => {
    const { contractAddress } = await deployErc20InvalidTransferEvent()

    const filter = await createEventFilter(publicClient, {
      event: event.invalid,
    })

    await writeContract(walletClient, {
      ...usdcContractConfig,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      abi: erc20InvalidTransferEventABI,
      address: contractAddress!,
      functionName: 'transfer',
      args: [accounts[0].address, 1n],
      account: address.vitalik,
    })
    await writeContract(walletClient, {
      abi: erc20InvalidTransferEventABI,
      address: contractAddress!,
      functionName: 'transfer',
      args: [accounts[1].address, 1n],
      account: address.vitalik,
    })
    await mine(testClient, { blocks: 1 })

    const logs = await getFilterLogs(publicClient, { filter })
    assertType<Log[]>(logs)
    expect(logs.length).toBe(2)
  })
})
