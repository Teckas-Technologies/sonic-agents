'use client';

import { PrivyProvider, addRpcUrlOverrideToChain } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
// import { mainnet } from 'viem/chains';

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
});

const solanamainnet = {
  id: 101,
  name: "solana",
  nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
  rpcUrls: {
    default: {
      http: ['https://solana-mainnet.g.alchemy.com/v2/H-LqusqbIhSz4K9KE8vQ9i8C4PQPGD-K'],
    }
  }
}

const INSERT_CUSTOM_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/H-LqusqbIhSz4K9KE8vQ9i8C4PQPGD-K";

export default function Providers({ children }: { children: React.ReactNode }) {
  const mainnetOverride = addRpcUrlOverrideToChain(solanamainnet, INSERT_CUSTOM_RPC_URL);
  console.log("Provider initialized!==========")
  return (
    <PrivyProvider
      appId="cm88qnp8y0007xnrcqokhbn5f"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          landingHeader: "Sonic Agents",
          loginMessage: "Use agents on top of sonic",
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
          walletChainType: 'solana-only',
        },
        // supportedChains: [mainnetOverride],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}