import type { Metadata } from 'next'
import './globals.css'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'ToolHub - الوجهة الأولى لأدوات الذكاء الاصطناعي',
  description: 'منصة ToolHub العربية - اكتشف أفضل أدوات الذكاء الاصطناعي للكتابة، التصميم، البرمجة، التسويق وأكثر. أدوات مجانية ومدفوعة لتعزيز إنتاجيتك.',
  keywords: 'أدوات الذكاء الاصطناعي, AI tools, كتابة ذكية, تصميم بالذكاء الاصطناعي, برمجة ذكية',
  authors: [{ name: 'ToolHub AI Platform' }],
  robots: 'index, follow, max-image-preview:large',
  openGraph: {
    title: 'ToolHub - الوجهة العربية لأدوات الذكاء الاصطناعي',
    description: 'منصة عربية شاملة لاكتشاف أفضل أدوات الذكاء الاصطناعي المجانية والمدفوعة',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ToolHub',
    images: [
      {
        url: 'https://toolhub.ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ToolHub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolHub - منصة أدوات الذكاء الاصطناعي العربية',
    description: 'اكتشف عالم أدوات الذكاء الاصطناعي مع منصتنا العربية المتكاملة',
    images: ['https://toolhub.ai/twitter-image.jpg']
  },
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover',
  themeColor: '#667eea'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
