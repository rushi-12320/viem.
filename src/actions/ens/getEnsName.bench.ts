import { bench, describe } from 'vitest'

import {
  ethersProvider,
  ethersV6Provider,
  publicClient,
  web3Provider,
} from '../../_test'

import { getEnsName } from './getEnsName'

describe('Get ENS Name', () => {
  bench('viem: `getEnsName`', async () => {
    await getEnsName(publicClient, {
      address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    })
  })

  bench('ethers: `lookupAddress`', async () => {
    await ethersProvider.lookupAddress(
      '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    )
  })

  bench('ethers@6: `lookupAddress`', async () => {
    await ethersV6Provider.lookupAddress(
      '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    )
  })
})
