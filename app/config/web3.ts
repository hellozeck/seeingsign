import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http()
  }
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  defaultChain: base,
  featuredWalletIds: [],
  themeMode: 'light'
})