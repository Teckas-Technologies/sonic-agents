'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
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