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
  
  // ✅ إعداد event listeners للتفاعلات
  useEffect(() => {
    // البحث الفوري مع debounce
    let searchTimeout: NodeJS.Timeout
    const searchInput = document.getElementById('searchInput') as HTMLInputElement
    
    if (searchInput) {
      const handleSearchInput = (e: Event) => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          handleSearch((e.target as HTMLInputElement).value)
        }, 300)
      }
      
      searchInput.addEventListener('input', handleSearchInput)
      
      return () => {
        searchInput.removeEventListener('input', handleSearchInput)
        clearTimeout(searchTimeout)
      }
    }
  }, [handleSearch])
  
  // ✅ Event listeners لأزرار الفلترة
  useEffect(() => {
    const filterButtons = document.querySelectorAll('.filter-btn')
    
    const handleFilterClick = (e: Event) => {
      const button = e.currentTarget as HTMLButtonElement
      const category = button.dataset.category
      if (category) {
        handleCategoryFilter(category)
      }
    }
    
    filterButtons.forEach(button => {
      button.addEventListener('click', handleFilterClick)
    })
    
    return () => {
      filterButtons.forEach(button => {
        button.removeEventListener('click', handleFilterClick)
      })
    }
  }, [handleCategoryFilter])
  
  // ✅ Event listener لـ select الترتيب
  useEffect(() => {
    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement
    
    if (sortSelect) {
      const handleSortSelect = (e: Event) => {
        handleSortChange((e.target as HTMLSelectElement).value)
      }
      
      sortSelect.addEventListener('change', handleSortSelect)
      
      return () => {
        sortSelect.removeEventListener('change', handleSortSelect)
      }
    }
  }, [handleSortChange])
  
  // ✅ Event listener لـ pagination buttons
  useEffect(() => {
    const prevPageBtn = document.getElementById('prevPageBtn')
    const nextPageBtn = document.getElementById('nextPageBtn')
    const pageNumbers = document.querySelectorAll('.page-number')
    
    const handlePrevPage = () => {
      const currentPage = parseInt(searchParams.get('page') || '1')
      if (currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    }
    
    const handleNextPage = () => {
      const currentPage = parseInt(searchParams.get('page') || '1')
      const totalTools = document.querySelectorAll('.tool-card').length
      if (totalTools === 20) { // إذا كانت الصفحة ممتلئة
        handlePageChange(currentPage + 1)
      }
    }
    
    const handlePageNumberClick = (e: Event) => {
      const button = e.currentTarget as HTMLButtonElement
      const page = parseInt(button.dataset.page || '1')
      handlePageChange(page)
    }
    
    prevPageBtn?.addEventListener('click', handlePrevPage)
    nextPageBtn?.addEventListener('click', handleNextPage)
    pageNumbers.forEach(button => {
      button.addEventListener('click', handlePageNumberClick)
    })
    
    return () => {
      prevPageBtn?.removeEventListener('click', handlePrevPage)
      nextPageBtn?.removeEventListener('click', handleNextPage)
      pageNumbers.forEach(button => {
        button.removeEventListener('click', handlePageNumberClick)
      })
    }
  }, [searchParams, handlePageChange])
  
  // ✅ Event listeners للثيم والقائمة الجانبية
  useEffect(() => {
    const themeToggleBtn = document.getElementById('themeToggle')
    const mobileMenuBtn = document.getElementById('mobileMenuBtn')
    const closeMobileMenuBtn = document.getElementById('closeMobileMenu')
    
    if (themeToggleBtn) {
      themeToggleBtn.onclick = toggleTheme
    }
    
    if (mobileMenuBtn) {
      mobileMenuBtn.onclick = openMobileMenu
    }
    
    if (closeMobileMenuBtn) {
      closeMobileMenuBtn.onclick = closeMobileMenu
    }
    
    return () => {
      if (themeToggleBtn) themeToggleBtn.onclick = null
      if (mobileMenuBtn) mobileMenuBtn.onclick = null
      if (closeMobileMenuBtn) closeMobileMenuBtn.onclick = null
    }
  }, [toggleTheme, openMobileMenu, closeMobileMenu])
  
  // ✅ Event listener لتبديل العرض
  useEffect(() => {
    const gridViewBtn = document.getElementById('gridViewBtn')
    const listViewBtn = document.getElementById('listViewBtn')
    
    const handleGridView = () => {
      handleViewChange('grid')
      gridViewBtn?.classList.add('active')
      listViewBtn?.classList.remove('active')
    }
    
    const handleListView = () => {
      handleViewChange('list')
      listViewBtn?.classList.add('active')
      gridViewBtn?.classList.remove('active')
    }
    
    gridViewBtn?.addEventListener('click', handleGridView)
    listViewBtn?.addEventListener('click', handleListView)
    
    return () => {
      gridViewBtn?.removeEventListener('click', handleGridView)
      listViewBtn?.removeEventListener('click', handleListView)
    }
  }, [handleViewChange])
  
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
  
  // ✅ Event listener لزر العودة للأعلى
  useEffect(() => {
    const backToTopBtn = document.getElementById('backToTop')
    
    const handleBackToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', handleBackToTop)
    }
    
    return () => {
      backToTopBtn?.removeEventListener('click', handleBackToTop)
    }
  }, [])
  
  // ✅ Event listener لأزرار التنقل
  useEffect(() => {
    const navButtons = document.querySelectorAll('.nav-links button')
    const footerButtons = document.querySelectorAll('.footer-links button')
    
    const handleNavClick = (e: Event) => {
      const button = e.currentTarget as HTMLButtonElement
      const section = button.dataset.section
      if (section) {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    
    navButtons.forEach(button => {
      button.addEventListener('click', handleNavClick)
    })
    
    footerButtons.forEach(button => {
      button.addEventListener('click', handleNavClick)
    })
    
    return () => {
      navButtons.forEach(button => {
        button.removeEventListener('click', handleNavClick)
      })
      footerButtons.forEach(button => {
        button.removeEventListener('click', handleNavClick)
      })
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
            <li><button onClick={() => { closeMobileMenu(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) }}>الرئيسية</button></li>
            <li><button onClick={() => { closeMobileMenu(); document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }) }}>الأدوات</button></li>
            <li><button onClick={() => { closeMobileMenu(); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }) }}>الفئات</button></li>
            <li><button onClick={() => { closeMobileMenu(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}>من نحن</button></li>
            <li><button onClick={() => { closeMobileMenu(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>اتصل بنا</button></li>
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
