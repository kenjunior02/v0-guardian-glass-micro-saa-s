import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// <CHANGE> Updated metadata for GuardianGlass security platform
export const metadata: Metadata = {
  title: 'GuardianGlass - Segurança Inteligente com IA',
  description: 'Plataforma MicroSaaS de gestão de segurança com IA gratuita integrada. Rondas em tempo real, análise de sentimento, alertas proativos e M-Pesa para Moçambique.',
  keywords: ['segurança', 'IA', 'guardas', 'Moçambique', 'M-Pesa', 'PWA', 'geofence', 'monitoramento'],
  generator: 'GuardianGlass',
  authors: [{ name: 'GuardianGlass Team' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#10B981',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
