import { expect, test } from 'vitest'
import { Mock4337AccountFactory } from '../../../test/contracts/generated.js'
import { anvilMainnet } from '../../../test/src/anvil.js'
import { accounts } from '../../../test/src/constants.js'
import { deployMock4337Account } from '../../../test/src/utils.js'
import { pad } from '../../utils/index.js'
import { mine } from '../test/mine.js'
import { writeContract } from '../wallet/writeContract.js'
import { getEip712Domain } from './getEip712Domain.js'
import { simulateContract } from './simulateContract.js'

const client = anvilMainnet.getClient()

test('default', async () => {
  const { factoryAddress } = await deployMock4337Account()

  const { result: address, request } = await simulateContract(client, {
    account: accounts[0].address,
    abi: Mock4337AccountFactory.abi,
    address: factoryAddress,
    functionName: 'createAccount',
    args: [accounts[0].address, pad('0x0')],
  })
  await writeContract(client, request)
  await mine(client, { blocks: 1 })

  expect(
    await getEip712Domain(client, {
      address,
    }),
  ).toMatchInlineSnapshot(`
    {
      "domain": {
        "chainId": 1,
        "name": "Mock4337Account",
        "salt": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "verifyingContract": "0x8a00708a83D977494139D21D618C6C2A71fA8ed1",
        "version": "1",
      },
      "extensions": [],
      "fields": "0x0f",
    }
  `)
})

test('error: non-existent', async () => {
  await expect(() =>
    getEip712Domain(client, {
      address: '0x0000000000000000000000000000000000000000',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `
    [Eip712DomainNotFoundError: No EIP-712 domain found on contract "0x0000000000000000000000000000000000000000".

    Ensure that:
    - The contract is deployed at the address "0x0000000000000000000000000000000000000000".
    - \`eip712Domain()\` function exists on the contract.
    - \`eip712Domain()\` function matches signature to ERC-5267 specification.

    Version: viem@x.y.z]
  `,
  )
})

test('error: default', async () => {
  await expect(() =>
    getEip712Domain(client, {
      address: '0x00000000000000000000000000000000000000000',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `
    [ContractFunctionExecutionError: Address "0x00000000000000000000000000000000000000000" is invalid.

    - Address must be a hex value of 20 bytes (40 hex characters).
    - Address must match its checksum counterpart.
     
    Raw Call Arguments:
      to:    0x00000000000000000000000000000000000000000
      data:  0x84b0196e
     
    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  eip712Domain()

    Docs: https://viem.sh/docs/contract/readContract
    Version: viem@x.y.z]
  `,
  )
})
