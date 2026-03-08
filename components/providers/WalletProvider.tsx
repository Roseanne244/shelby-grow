'use client'

/**
 * WalletProvider.tsx
 *
 * Wraps the app with Aptos Wallet Adapter context.
 * Supports Petra wallet by default.
 *
 * When Shelby early access is active, wallet address is used as:
 * - User namespace for blob storage (e.g. 0x1234.../filename.jpg)
 * - Identity for on-chain streak + leaderboard records
 * - Payment authorization for Shelby micropayment channels
 */

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { PetraWallet } from '@aptos-labs/wallet-adapter-petra'
import { useMemo } from 'react'

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const wallets = useMemo(() => [new PetraWallet()], [])

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={false}
      onError={(error) => {
        console.error('[WalletProvider] Error:', error)
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
