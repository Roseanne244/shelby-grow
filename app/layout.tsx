import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from '@/components/providers/WalletProvider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shelby Grow — Gamified Decentralized Storage',
  description:
    'Turn daily file storage into a habit. Upload files, grow your garden, compete on the leaderboard — all on the Shelby Protocol.',
  keywords: ['Shelby', 'Aptos', 'decentralized storage', 'Web3', 'gamification'],
  openGraph: {
    title: 'Shelby Grow',
    description: 'Gamified daily storage on Shelby Protocol',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="bg-bg text-text antialiased">
        <WalletProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#181b27',
                color: '#e8eaf0',
                border: '1px solid #252840',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  )
}
