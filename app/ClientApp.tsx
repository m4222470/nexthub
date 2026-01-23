'use client'

console.log('🔥 ClientApp LOADED')

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface ClientAppProps {
  // يمكن إضافة props هنا إذا لزم الأمر مستقبلاً
}

export default function ClientApp({ }: ClientAppProps) {
  console.log('🔥 ClientApp RENDERED')
  
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
  // 🎯 Event Delegation المركزي المحسّن
  // ============================================
  useEffect(() => {
    console.log('🎯 Event Delegation جاهز')
    
    const handleGlobalClick = (e: Event) => {
      e.preventDefault() // ✅ منع السلوك الافتراضي أولاً
      
      const target = e.target as HTMLElement
      
      // 🔍 البحث عن العنصر الذي يحتوي على data attribute مباشرة
      const elementWithData = findElementWithDataAttribute(target)
      
      if (!elementWithData) return
      
      // 1️⃣ فلترة الفئات
      if (elementWithData.dataset.category) {
        console.log('🖱️ تم النقر على فلترة:', elementWithData.dataset.category)
        handleCategoryFilter(elementWithData.dataset.category)
        return
      }
      
      // 2️⃣ أزرار الصفحات (pagination)
      if (elementWithData.dataset.page) {
        console.log('🖱️ زر رقم الصفحة:', elementWithData.dataset.page)
        const page = parseInt(elementWithData.dataset.page || '1')
        handlePageChange(page)
        return
      }
      
      // 3️⃣ أزرار التنقل
      if (elementWithData.dataset.section) {
        console.log('🖱️ تنقل إلى:', elementWithData.dataset.section)
        const section = elementWithData.dataset.section
        if (section) {
          const element = document.getElementById(section)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        return
      }
    }
    
    // دالة مساعدة للعثور على العنصر مع data attribute
    const findElementWithDataAttribute = (element: HTMLElement): HTMLElement | null => {
      let currentElement: HTMLElement | null = element
      
      while (currentElement) {
        if (currentElement.dataset && 
            (currentElement.dataset.category || 
             currentElement.dataset.page || 
             currentElement.dataset.section)) {
          return currentElement
        }
        
        // إذا لم نجد، ننتقل إلى العنصر الأب
        currentElement = currentElement.parentElement
      }
      
      return null
    }
    
    // 4️⃣ معالجة الأزرار الخاصة حسب الـ ID
    const handleSpecialButtons = (e: Event) => {
      const target = e.target as HTMLElement
      
      // زر الثيم
      if (target.id === 'themeToggle' || target.closest('#themeToggle')) {
        console.log('🖱️ تبديل الثيم')
        e.preventDefault()
        toggleTheme()
        return
      }
      
      // زر فتح القائمة الجانبية
      if (target.id === 'mobileMenuBtn' || target.closest('#mobileMenuBtn')) {
        console.log('🖱️ فتح القائمة الجانبية')
        e.preventDefault()
        setMobileMenuOpen(true)
        document.body.style.overflow = 'hidden'
        return
      }
      
      // زر إغلاق القائمة الجانبية
      if (target.id === 'closeMobileMenu' || target.closest('#closeMobileMenu')) {
        console.log('🖱️ إغلاق القائمة الجانبية')
        e.preventDefault()
        setMobileMenuOpen(false)
        document.body.style.overflow = 'auto'
        return
      }
      
      // زر العودة للأعلى
      if (target.id === 'backToTop' || target.closest('#backToTop')) {
        console.log('🖱️ العودة للأعلى')
        e.preventDefault()
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        return
      }
      
      // زر استكشاف الأدوات
      if (target.id === 'exploreToolsBtn' || target.closest('#exploreToolsBtn')) {
        console.log('🖱️ استكشاف الأدوات')
        e.preventDefault()
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      
      // أزرار عرض الشبكة/القائمة
      if (target.id === 'gridViewBtn' || target.closest('#gridViewBtn')) {
        console.log('🖱️ عرض الشبكة')
        e.preventDefault()
        setActiveView('grid')
        return
      }
      
      if (target.id === 'listViewBtn' || target.closest('#listViewBtn')) {
        console.log('🖱️ عرض القائمة')
        e.preventDefault()
        setActiveView('list')
        return
      }
      
      // أزرار الصفحة السابقة/التالية
      if (target.id === 'prevPageBtn' || target.closest('#prevPageBtn')) {
        console.log('🖱️ زر الصفحة السابقة')
        e.preventDefault()
        const currentPage = parseInt(searchParams.get('page') || '1')
        if (currentPage > 1) {
          handlePageChange(currentPage - 1)
        }
        return
      }
      
      if (target.id === 'nextPageBtn' || target.closest('#nextPageBtn')) {
        console.log('🖱️ زر الصفحة التالية')
        e.preventDefault()
        const currentPage = parseInt(searchParams.get('page') || '1')
        handlePageChange(currentPage + 1)
        return
      }
    }
    
    // دالة المشترك لجميع الأحداث
    const combinedHandler = (e: Event) => {
      handleGlobalClick(e)
      handleSpecialButtons(e)
    }
    
    document.addEventListener('click', combinedHandler)
    
    return () => {
      document.removeEventListener('click', combinedHandler)
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
