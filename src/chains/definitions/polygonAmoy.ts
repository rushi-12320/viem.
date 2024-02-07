import { defineChain } from '../../utils/chain/defineChain.js'

export const polygonMumbai = /*#__PURE__*/ defineChain({
  id: 80_002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OK LINK',
      url: 'https://www.oklink.com/amoy',
      apiUrl: 'https://www.oklink.com/amoy',
    },
  },
  testnet: true,
})