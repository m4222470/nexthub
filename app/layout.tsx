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
        
        {/* ✅ إضافة Script لمنع FOUC وتحسين تحميل الثيم */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // منع الوميض (FOUC) عند تحميل الثيم
                try {
                  const savedTheme = localStorage.getItem('toolhub-theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                  
                  // تطبيق الثيم فوراً
                  document.documentElement.setAttribute('data-theme', initialTheme);
                  document.documentElement.classList.add('no-transition');
                  
                  // إزالة class no-transition بعد تحميل الصفحة
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                      setTimeout(() => {
                        document.documentElement.classList.remove('no-transition');
                        // تحديث أيقونة الثيم
                        const themeIcon = document.querySelector('#themeToggle i');
                        if (themeIcon) {
                          themeIcon.className = initialTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                        }
                      }, 50);
                    });
                  } else {
                    setTimeout(() => {
                      document.documentElement.classList.remove('no-transition');
                      // تحديث أيقونة الثيم
                      const themeIcon = document.querySelector('#themeToggle i');
                      if (themeIcon) {
                        themeIcon.className = initialTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                      }
                    }, 50);
                  }
                  
                  // مراقبة تغييرات النظام للثيم
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    const currentTheme = localStorage.getItem('toolhub-theme');
                    if (!currentTheme || currentTheme === 'auto') {
                      const newTheme = e.matches ? 'dark' : 'light';
                      document.documentElement.setAttribute('data-theme', newTheme);
                      const themeIcon = document.querySelector('#themeToggle i');
                      if (themeIcon) {
                        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                      }
                    }
                  });
                } catch (e) {
                  console.warn('خطأ في تحميل الثيم:', e);
                }
                
                // تهيئة PWA (تثبيت التطبيق)
                let deferredPrompt;
                window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault();
                  deferredPrompt = e;
                  const installBtn = document.getElementById('installBtn');
                  if (installBtn) {
                    installBtn.style.display = 'flex';
                    installBtn.addEventListener('click', async () => {
                      if (deferredPrompt) {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                          installBtn.style.display = 'none';
                        }
                      }
                    });
                  }
                });
                
                // إخفاء loading overlay بعد التحميل
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const overlay = document.getElementById('loadingOverlay');
                    if (overlay) {
                      overlay.classList.add('hidden');
                    }
                  }, 1000);
                });
              })();
            `
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
