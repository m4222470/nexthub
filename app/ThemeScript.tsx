'use client'

import { useEffect } from 'react'

export default function ThemeScript() {
  useEffect(() => {
    // ✅ تطبيق الثيم فور تحميل العميل لمنع FOUC (Flash of Unstyled Content)
    const theme = localStorage.getItem('toolhub-theme') || 'light'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme

    // تطبيق الثيم فوراً
    document.documentElement.setAttribute('data-theme', initialTheme)

    // إضافة class لمنع الانتقالات المؤقتة
    document.documentElement.classList.add('no-transition')

    // إزالة class no-transition بعد فترة قصيرة
    setTimeout(() => {
      document.documentElement.classList.remove('no-transition')
    }, 50)

    // ✅ تحديث أيقونة الثيم بناءً على الثيم الحالي
    const updateThemeIcon = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      const themeIcon = document.querySelector('#themeToggle i')
      if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
      }
    }

    // ✅ مراقبة تغييرات localStorage للثيم
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'toolhub-theme') {
        const newTheme = e.newValue || 'light'
        document.documentElement.setAttribute('data-theme', newTheme)
        updateThemeIcon()
      }
    }

    // ✅ مراقبة تغييرات النظام للثيم
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const theme = localStorage.getItem('toolhub-theme')
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
        updateThemeIcon()
      }
    }

    // ✅ تحديث الأيقونة أول مرة
    updateThemeIcon()

    // ✅ إضافة event listeners
    window.addEventListener('storage', handleStorageChange)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // ✅ تنظيف event listeners عند unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  return null // لا تعرض أي شيء في DOM
}
