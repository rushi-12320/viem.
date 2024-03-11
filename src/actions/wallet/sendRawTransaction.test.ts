import { expect, test } from 'vitest'
import { accounts } from '~test/src/constants.js'
import { kzg } from '~test/src/kzg.js'
import { walletClient } from '~test/src/utils.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { sepolia } from '../../chains/index.js'
import { http, createClient, parseGwei, stringToHex } from '../../index.js'
import { toBlobs } from '../../utils/blob/toBlobs.js'
import { getTransactionCount } from '../index.js'
import { prepareTransactionRequest } from './prepareTransactionRequest.js'
import { sendRawTransaction } from './sendRawTransaction.js'
import { signTransaction } from './signTransaction.js'

test('default', async () => {
  const request = await prepareTransactionRequest(walletClient, {
    account: privateKeyToAccount(accounts[0].privateKey),
    to: accounts[1].address,
    value: 1n,
  })
  const serializedTransaction = await signTransaction(walletClient, request)
  const hash = await sendRawTransaction(walletClient, { serializedTransaction })
  expect(hash).toBeDefined()
})

test.skip('4844', async () => {
  const client = createClient({
    chain: sepolia,
    transport: http('https://ethereum-sepolia.publicnode.com'),
  })

  const privateKey = '0x'
  const account = privateKeyToAccount(privateKey)
  const blobs = toBlobs({ data: stringToHex('hello wwworld') })
  const nonce = await getTransactionCount(client, {
    address: account.address,
    blockTag: 'pending',
  })
  const serialized = await account.signTransaction({
    blobs,
    chainId: sepolia.id,
    kzg,
    maxFeePerBlobGas: parseGwei('100'),
    maxFeePerGas: parseGwei('100'),
    maxPriorityFeePerGas: parseGwei('5'),
    nonce,
    gas: 21000n,
    to: '0x0000000000000000000000000000000000000000',
    type: 'eip4844',
  })
  const hash = await sendRawTransaction(client, {
    serializedTransaction: serialized,
  })
  expect(hash).toBeDefined()
}, 20_000)
