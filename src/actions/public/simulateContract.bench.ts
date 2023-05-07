import { Contract } from 'ethers'

import { Contract as ContractV6, Typed } from 'ethers@6'

import { bench, describe } from 'vitest'

import { wagmiContractConfig } from '../../_test/abis.js'
import { ethersProvider, ethersV6Provider } from '../../_test/bench.js'
import { accounts } from '../../_test/constants.js'
import { publicClient } from '../../_test/utils.js'

import { simulateContract } from './simulateContract.js'

describe('Simulate Contract', () => {
  bench('viem: `simulateContract`', async () => {
    await simulateContract(publicClient, {
      ...wagmiContractConfig,
      functionName: 'mint',
      args: [42111n],
      account: accounts[0].address,
    })
  })

  bench('ethers@5: `callStatic`', async () => {
    const wagmi = new Contract(
      wagmiContractConfig.address,
      wagmiContractConfig.abi,
      ethersProvider,
    )
    await wagmi.callStatic['mint(uint256)'](42111, {
      from: accounts[0].address,
    })
  })

  bench('ethers@6: `callStatic`', async () => {
    const wagmi = new ContractV6(
      wagmiContractConfig.address,
      wagmiContractConfig.abi,
      ethersV6Provider,
    )
    await wagmi.mint.staticCall(Typed.uint(42111), {
      from: accounts[0].address,
    })
  })
})
