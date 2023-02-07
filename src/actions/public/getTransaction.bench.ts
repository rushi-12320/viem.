import { bench, describe } from 'vitest'

import {
  ethersProvider,
  ethersV6Provider,
  publicClient,
  web3Provider,
} from '../../_test'

import { getTransaction } from './getTransaction'

const hash =
  '0xa4b1f606b66105fa45cb5db23d2f6597075701e7f0e2367f4e6a39d17a8cf98b'

describe('Get Transaction', () => {
  bench('viem: `getTransaction`', async () => {
    await getTransaction(publicClient, {
      hash,
    })
  })

  bench('ethers: `getTransaction`', async () => {
    await ethersProvider.getTransaction(hash)
  })

  bench('ethers@6: `getTransaction`', async () => {
    await ethersV6Provider.getTransaction(hash)
  })

  bench('web3.js: `getTransaction`', async () => {
    await web3Provider.eth.getTransaction(hash)
  })
})
