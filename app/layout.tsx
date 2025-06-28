import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RealEstatePro CRM',
  description: 'Next-generation multi-tenant real estate management platform',
  keywords: ['real estate', 'CRM', 'property management', 'tenant management'],
  authors: [{ name: 'RealEstatePro Team' }],
  creator: 'RealEstatePro',
  publisher: 'RealEstatePro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'RealEstatePro CRM',
    description: 'Next-generation multi-tenant real estate management platform',
    siteName: 'RealEstatePro CRM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealEstatePro CRM',
    description: 'Next-generation multi-tenant real estate management platform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
} 