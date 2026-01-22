'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

// ✅ إضافة interface للـ props
interface ClientAppProps {
  // يمكن إضافة props هنا إذا لزم الأمر مستقبلاً
}

export default function ClientApp({ }: ClientAppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // ✅ تهيئة الثيم عند تحميل الصفحة
  useEffect(() => {
    // ✅ تطبيق الثيم المخزن
    const savedTheme = localStorage.getItem('toolhub-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    
    // ✅ تحديث أيقونة الثيم بناءً على الثيم الحالي
    const updateThemeIcon = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      const themeIcon = document.querySelector('#themeToggle i')
      if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
      }
    }
    
    updateThemeIcon()
  }, [])
  
  // ✅ تبديل الثيم - مع تحسين
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // تحديث DOM و localStorage
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('toolhub-theme', newTheme)
    
    // تحديث أيقونة الثيم
    const themeIcon = document.querySelector('#themeToggle i')
    if (themeIcon) {
      themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
    }
  }, [theme])
  
  // ✅ فتح وإغلاق القائمة الجانبية
  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])
  
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
    document.body.style.overflow = 'auto'
  }, [])
  
  // ✅ تبديل العرض (Grid/List)
  const handleViewChange = useCallback((view: 'grid' | 'list') => {
    setActiveView(view)
    
    const container = document.getElementById('toolsGridContainer')
    if (container) {
      if (view === 'list') {
        container.classList.add('list-view')
      } else {
        container.classList.remove('list-view')
      }
    }
  }, [])
  
  // ✅ البحث الفوري مع debounce
  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])
  
  // ✅ الفلترة بالفئة
  const handleCategoryFilter = useCallback((category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])
  
  // ✅ تغيير الترتيب
  const handleSortChange = useCallback((sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])
  
  // ✅ تغيير الصفحة
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }, [router, pathname, searchParams])
  
  // ✅ Event Delegation للفلترة (الحل الذهبي)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // 1. فلترة الأزرار
      const filterButton = target.closest('.filter-btn')
      if (filterButton) {
        const category = (filterButton as HTMLButtonElement).dataset.category
        if (category) {
          handleCategoryFilter(category)
          e.preventDefault()
          return
        }
      }
      
      // 2. أزرار الصفحات (pagination)
      const prevPageBtn = target.closest('#prevPageBtn')
      if (prevPageBtn && !prevPageBtn.hasAttribute('disabled')) {
        const currentPage = parseInt(searchParams.get('page') || '1')
        if (currentPage > 1) {
          handlePageChange(currentPage - 1)
          e.preventDefault()
          return
        }
      }
      
      const nextPageBtn = target.closest('#nextPageBtn')
      if (nextPageBtn && !nextPageBtn.hasAttribute('disabled')) {
        const currentPage = parseInt(searchParams.get('page') || '1')
        // نفترض أن هناك صفحة تالية (سيتم التحقق في backend)
        handlePageChange(currentPage + 1)
        e.preventDefault()
        return
      }
      
      const pageNumber = target.closest('.page-number')
      if (pageNumber) {
        const page = parseInt((pageNumber as HTMLButtonElement).dataset.page || '1')
        handlePageChange(page)
        e.preventDefault()
        return
      }
      
      // 3. أزرار تبديل العرض (Grid/List)
      const gridViewBtn = target.closest('#gridViewBtn')
      if (gridViewBtn) {
        handleViewChange('grid')
        gridViewBtn.classList.add('active')
        const listViewBtn = document.getElementById('listViewBtn')
        if (listViewBtn) listViewBtn.classList.remove('active')
        e.preventDefault()
        return
      }
      
      const listViewBtn = target.closest('#listViewBtn')
      if (listViewBtn) {
        handleViewChange('list')
        listViewBtn.classList.add('active')
        const gridViewBtn = document.getElementById('gridViewBtn')
        if (gridViewBtn) gridViewBtn.classList.remove('active')
        e.preventDefault()
        return
      }
      
      // 4. أزرار التنقل في header
      const navButton = target.closest('.nav-links button')
      if (navButton) {
        const section = (navButton as HTMLButtonElement).dataset.section
        if (section) {
          const element = document.getElementById(section)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        e.preventDefault()
        return
      }
      
      // 5. أزرار التنقل في footer
      const footerButton = target.closest('.footer-links button')
      if (footerButton) {
        const buttonText = footerButton.textContent
        const sections: Record<string, string> = {
          'الرئيسية': 'home',
          'الأدوات': 'tools',
          'الفئات': 'categories',
          'من نحن': 'about',
          'اتصل بنا': 'contact'
        }
        
        const sectionId = sections[buttonText || '']
        if (sectionId) {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        e.preventDefault()
        return
      }
      
      // 6. زر الثيم
      const themeToggle = target.closest('#themeToggle')
      if (themeToggle) {
        toggleTheme()
        e.preventDefault()
        return
      }
      
      // 7. زر فتح القائمة الجانبية
      const mobileMenuBtn = target.closest('#mobileMenuBtn')
      if (mobileMenuBtn) {
        openMobileMenu()
        e.preventDefault()
        return
      }
      
      // 8. زر إغلاق القائمة الجانبية
      const closeMobileMenuBtn = target.closest('#closeMobileMenu')
      if (closeMobileMenuBtn) {
        closeMobileMenu()
        e.preventDefault()
        return
      }
      
      // 9. أزرار القائمة الجانبية
      const mobileNavButton = target.closest('.mobile-nav-links button')
      if (mobileNavButton) {
        const buttonText = mobileNavButton.textContent
        const sections: Record<string, string> = {
          'الرئيسية': 'home',
          'الأدوات': 'tools',
          'الفئات': 'categories',
          'من نحن': 'about',
          'اتصل بنا': 'contact'
        }
        
        const sectionId = sections[buttonText || '']
        if (sectionId) {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        closeMobileMenu()
        e.preventDefault()
        return
      }
      
      // 10. زر العودة للأعلى
      const backToTopBtn = target.closest('#backToTop')
      if (backToTopBtn) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        e.preventDefault()
        return
      }
    }
    
    // إضافة الـ event listener مرة واحدة على document
    document.addEventListener('click', handleClick)
    
    // تنظيف الـ event listener عند unmount
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [handleCategoryFilter, handlePageChange, handleViewChange, toggleTheme, openMobileMenu, closeMobileMenu, searchParams])
  
  // ✅ Event Delegation للبحث (input events)
  useEffect(() => {
    let searchTimeout: NodeJS.Timeout
    
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      
      // البحث
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
    const handleChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      
      // ترتيب الأدوات
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
    const overlay = document.getElementById('loadingOverlay')
    if (overlay) {
      setTimeout(() => {
        overlay.classList.add('hidden')
      }, 1000)
    }
  }, [])
  
  // ✅ إظهار/إخفاء زر العودة للأعلى
  useEffect(() => {
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
  
  // ✅ تنظيف عند unmount
  useEffect(() => {
    return () => {
      // تنظيف أي event listeners إضافية
    }
  }, [])
  
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
            <li><button>الرئيسية</button></li>
            <li><button>الأدوات</button></li>
            <li><button>الفئات</button></li>
            <li><button>من نحن</button></li>
            <li><button>اتصل بنا</button></li>
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
