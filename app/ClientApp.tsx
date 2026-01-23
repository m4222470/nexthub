'use client'

console.log('🔥 ClientApp LOADED') // 🔥 اختبار التحميل

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface ClientAppProps {
  // يمكن إضافة props هنا إذا لزم الأمر مستقبلاً
}

export default function ClientApp({ }: ClientAppProps) {
  console.log('🔥 ClientApp RENDERED') // 🔥 اختبار التصيير
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ============================================
  // 🔧 تعريف جميع الدوال هنا (قبل useEffect)
  // ============================================

  // ✅ 1. تبديل الثيم
  const toggleTheme = useCallback(() => {
    console.log('🎨 تبديل الثيم')
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('toolhub-theme', newTheme)
    
    const themeIcon = document.querySelector('#themeToggle i')
    if (themeIcon) {
      themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
    }
  }, [theme])

  // ✅ 2. البحث الفوري
  const handleSearch = useCallback((query: string) => {
    console.log('🔍 البحث:', query)
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // ✅ 3. الفلترة بالفئة
  const handleCategoryFilter = useCallback((category: string) => {
    console.log('🏷️ فلترة الفئة:', category)
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // ✅ 4. تغيير الترتيب
  const handleSortChange = useCallback((sort: string) => {
    console.log('📊 ترتيب:', sort)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // ✅ 5. تغيير الصفحة
  const handlePageChange = useCallback((page: number) => {
    console.log('📄 صفحة:', page)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }, [router, pathname, searchParams])

  // ============================================
  // 🎯 Event Delegation المركزي مع Type Safety
  // ============================================
  useEffect(() => {
    console.log('🎯 Event Delegation جاهز')
    
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // 1️⃣ فلترة الفئات - مع تحقق من HTMLElement
      const filterBtn = (target as Element).closest('.filter-btn')
      if (filterBtn instanceof HTMLElement && filterBtn.dataset.category) {
        console.log('🖱️ تم النقر على فلترة:', filterBtn.dataset.category)
        e.preventDefault()
        handleCategoryFilter(filterBtn.dataset.category)
        return
      }
      
      // 2️⃣ أزرار الصفحات (pagination)
      const prevPageBtn = target.closest('#prevPageBtn')
      if (prevPageBtn && !prevPageBtn.hasAttribute('disabled')) {
        console.log('🖱️ زر الصفحة السابقة')
        e.preventDefault()
        const currentPage = parseInt(searchParams.get('page') || '1')
        if (currentPage > 1) {
          handlePageChange(currentPage - 1)
        }
        return
      }
      
      const nextPageBtn = target.closest('#nextPageBtn')
      if (nextPageBtn && !nextPageBtn.hasAttribute('disabled')) {
        console.log('🖱️ زر الصفحة التالية')
        e.preventDefault()
        const currentPage = parseInt(searchParams.get('page') || '1')
        handlePageChange(currentPage + 1)
        return
      }
      
      const pageNumber = (target as Element).closest('.page-number')
      if (pageNumber instanceof HTMLElement && pageNumber.dataset.page) {
        console.log('🖱️ زر رقم الصفحة:', pageNumber.dataset.page)
        e.preventDefault()
        const page = parseInt(pageNumber.dataset.page || '1')
        handlePageChange(page)
        return
      }
      
      // 3️⃣ أزرار تبديل العرض (Grid/List)
      const gridViewBtn = target.closest('#gridViewBtn')
      if (gridViewBtn) {
        console.log('🖱️ عرض الشبكة')
        e.preventDefault()
        setActiveView('grid')
        return
      }
      
      const listViewBtn = target.closest('#listViewBtn')
      if (listViewBtn) {
        console.log('🖱️ عرض القائمة')
        e.preventDefault()
        setActiveView('list')
        return
      }
      
      // 4️⃣ أزرار التنقل باستخدام data-section - مع تحقق من HTMLElement
      const navButton = (target as Element).closest('[data-section]')
      if (navButton instanceof HTMLElement && navButton.dataset.section) {
        console.log('🖱️ تنقل إلى:', navButton.dataset.section)
        e.preventDefault()
        const section = navButton.dataset.section
        if (section) {
          const element = document.getElementById(section)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        return
      }
      
      // 5️⃣ زر الثيم
      const themeToggle = target.closest('#themeToggle')
      if (themeToggle) {
        console.log('🖱️ تبديل الثيم')
        e.preventDefault()
        toggleTheme()
        return
      }
      
      // 6️⃣ زر فتح القائمة الجانبية
      const mobileMenuBtn = target.closest('#mobileMenuBtn')
      if (mobileMenuBtn) {
        console.log('🖱️ فتح القائمة الجانبية')
        e.preventDefault()
        setMobileMenuOpen(true)
        document.body.style.overflow = 'hidden'
        return
      }
      
      // 7️⃣ زر إغلاق القائمة الجانبية
      const closeMobileMenuBtn = target.closest('#closeMobileMenu')
      if (closeMobileMenuBtn) {
        console.log('🖱️ إغلاق القائمة الجانبية')
        e.preventDefault()
        setMobileMenuOpen(false)
        document.body.style.overflow = 'auto'
        return
      }
      
      // 8️⃣ النقر خارج القائمة الجانبية لإغلاقها
      const mobileMenu = document.getElementById('mobileMenu')
      if (
        mobileMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(target) &&
        !target.closest('#mobileMenuBtn')
      ) {
        console.log('🖱️ إغلاق القائمة بالنقر خارجها')
        e.preventDefault()
        setMobileMenuOpen(false)
        document.body.style.overflow = 'auto'
        return
      }
      
      // 9️⃣ زر العودة للأعلى
      const backToTopBtn = target.closest('#backToTop')
      if (backToTopBtn) {
        console.log('🖱️ العودة للأعلى')
        e.preventDefault()
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        return
      }
      
      // 🔟 أزرار CTA و Hero
      const exploreToolsBtn = target.closest('#exploreToolsBtn')
      if (exploreToolsBtn) {
        console.log('🖱️ استكشاف الأدوات')
        e.preventDefault()
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      
      const watchDemoBtn = target.closest('#watchDemoBtn')
      if (watchDemoBtn) {
        console.log('🖱️ مشاهدة العرض')
        e.preventDefault()
        // يمكن فتح modal أو تنفيذ أي action هنا
        return
      }
      
      const ctaBtn = target.closest('.cta-btn')
      if (ctaBtn) {
        console.log('🖱️ CTA زر')
        e.preventDefault()
        // يمكن فتح modal تسجيل هنا
        return
      }
    }
    
    document.addEventListener('click', handleGlobalClick)
    
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [
    handleCategoryFilter, 
    handlePageChange, 
    toggleTheme, 
    mobileMenuOpen, 
    searchParams
  ])

  // ✅ تطبيق عرض الأدوات (Grid/List) بناءً على activeView
  useEffect(() => {
    console.log('🎨 تغيير العرض إلى:', activeView)
    const container = document.getElementById('toolsGridContainer')
    if (container) {
      if (activeView === 'list') {
        container.classList.add('list-view')
      } else {
        container.classList.remove('list-view')
      }
    }
  }, [activeView])

  // ✅ تهيئة الثيم عند تحميل الصفحة
  useEffect(() => {
    console.log('🎨 تهيئة الثيم')
    const savedTheme = localStorage.getItem('toolhub-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    
    const updateThemeIcon = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      const themeIcon = document.querySelector('#themeToggle i')
      if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
      }
    }
    
    updateThemeIcon()
  }, [])

  // ✅ Event Delegation للبحث (input events)
  useEffect(() => {
    console.log('🔍 تهيئة بحث فوري')
    let searchTimeout: NodeJS.Timeout
    
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      
      if (target.id === 'searchInput') {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          handleSearch(target.value)
        }, 300)
      }
    }
    
    document.addEventListener('input', handleInput)
    
    return () => {
      document.removeEventListener('input', handleInput)
      clearTimeout(searchTimeout)
    }
  }, [handleSearch])

  // ✅ Event Delegation للترتيب (change events)
  useEffect(() => {
    console.log('📊 تهيئة ترتيب')
    const handleChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      
      if (target.id === 'sortSelect') {
        handleSortChange(target.value)
      }
    }
    
    document.addEventListener('change', handleChange)
    
    return () => {
      document.removeEventListener('change', handleChange)
    }
  }, [handleSortChange])

  // ✅ إخفاء loading overlay بعد التحميل
  useEffect(() => {
    console.log('⏳ إخفاء loading overlay')
    const overlay = document.getElementById('loadingOverlay')
    if (overlay) {
      setTimeout(() => {
        overlay.classList.add('hidden')
        console.log('✅ تم إخفاء loading overlay')
      }, 1000)
    } else {
      console.warn('⚠️ loading overlay غير موجود')
    }
  }, [])

  // ✅ إظهار/إخفاء زر العودة للأعلى
  useEffect(() => {
    console.log('🔼 تهيئة زر العودة للأعلى')
    const handleScroll = () => {
      const backToTopBtn = document.getElementById('backToTop')
      if (backToTopBtn) {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('visible')
        } else {
          backToTopBtn.classList.remove('visible')
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // ✅ إغلاق القائمة الجانبية عند الضغط على زر الهروب (Escape)
  useEffect(() => {
    console.log('🔒 تهيئة إغلاق بالقائمة الجانبية بالـ Escape')
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
        document.body.style.overflow = 'auto'
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen])

  // ✅ إغلاق القائمة الجانبية عند تغيير حجم النافذة
  useEffect(() => {
    console.log('📱 تهيئة إغلاق القائمة بتغيير الحجم')
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false)
        document.body.style.overflow = 'auto'
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <div className="mobile-menu-header">
          <button className="close-mobile-menu" id="closeMobileMenu">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-links">
            <li><button data-section="home">الرئيسية</button></li>
            <li><button data-section="tools">الأدوات</button></li>
            <li><button data-section="categories">الفئات</button></li>
            <li><button data-section="about">من نحن</button></li>
            <li><button data-section="contact">اتصل بنا</button></li>
          </ul>
        </div>
      </div>
      
      {/* Toast Container */}
      <div className="toast-container" id="toastContainer"></div>
      
      {/* Install Button */}
      <button className="install-btn" id="installBtn" style={{ display: 'none' }}>
        <i className="fas fa-download"></i>
        <span>تثبيت التطبيق</span>
      </button>
    </>
  )
}
