import type { Address, ByteArray, Hex } from '../../types'
import { encodeBytes, encodeRlp } from '../encoding'
import { keccak256 } from '../hash'
import { getAddress } from './getAddress'

export type GetCreateAddressOptions = {
  from: Address
  nonce: bigint
}

export type GetCreate2AddressOptions = {
  bytecode: ByteArray | Hex
  from: Address
  salt: ByteArray | Hex
}

export type GetContractAddressOptions =
  | ({
      opcode?: 'CREATE'
    } & GetCreateAddressOptions)
  | ({ opcode: 'CREATE2' } & GetCreate2AddressOptions)

export function getContractAddress(opts: GetContractAddressOptions) {
  if (opts.opcode === 'CREATE2') return getCreate2Address(opts)
  return getCreateAddress(opts)
}

export function getCreateAddress(opts: GetCreateAddressOptions) {
  const from = encodeBytes(getAddress(opts.from))

  let nonce = encodeBytes(opts.nonce)
  if (nonce[0] === 0) nonce = new Uint8Array([])

  return getAddress(
    ('0x' + keccak256(encodeRlp([from, nonce], 'bytes')).slice(26)) as Address,
  )
}

export function getCreate2Address(_opts: GetCreate2AddressOptions) {
  throw new Error('TODO')
}
