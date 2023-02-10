import { useState } from 'react'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { createWalletClient, custom } from 'viem'
import { arbitrum, goerli, mainnet, optimism, polygon } from 'viem/chains'

import { SendTransaction } from '../actions/SendTransaction'

const chains = [arbitrum, goerli, mainnet, optimism, polygon]
const walletConnectProvider = new WalletConnectProvider({
  rpc: chains.reduce(
    (rpcMap, chain) => ({
      ...rpcMap,
      [chain.id]: chain.rpcUrls.default.http[0],
    }),
    {},
  ),
})
const client = createWalletClient({
  transport: custom(walletConnectProvider),
})

export function WalletConnectWallet() {
  const [connected, setConnected] = useState(false)
  if (!client) return null
  if (!connected)
    return (
      <button
        onClick={async () => {
          await walletConnectProvider.enable()
          setConnected(true)
        }}
      >
        connect
      </button>
    )
  return (
    <div>
      <hr />
      <h3>sendTransaction</h3>
      <SendTransaction client={client} />
    </div>
  )
}
