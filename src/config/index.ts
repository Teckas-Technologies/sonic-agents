import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'


// Get projectId from https://cloud.reown.com
export const projectId = "9828c056d059c5666b46a777dfe63bd4" // this is a public projectId only to use on localhost

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// https://solana-mainnet.g.alchemy.com/v2/H-LqusqbIhSz4K9KE8vQ9i8C4PQPGD-K

export const networks = [solana, solanaTestnet, solanaDevnet] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up Solana Adapter
export const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [
        new PhantomWalletAdapter({ network: "mainnet-beta" }),
        new SolflareWalletAdapter()
    ]
})