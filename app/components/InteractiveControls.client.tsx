'use client'

import { useState, useEffect } from 'react'
import { useUrlState } from '@/app/hooks/useUrlState'

export default function InteractiveControls() {
  const { category, query, sort, page, updateUrl } = useUrlState()
  
  // State للبحث الفوري
  const [searchValue, setSearchValue] = useState(query)
  const [debouncedValue, setDebouncedValue] = useState(query)
  
  // State للقائمة الجانبية
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // State للثيم
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // State للزر العودة للأعلى
  const [showBackToTop, setShowBackToTop] = useState(false)

  // 🔄 Debounce البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  useEffect(() => {
    if (debouncedValue !== query) {
      updateUrl('query', debouncedValue || null)
    }
  }, [debouncedValue, query, updateUrl])

  // 🎨 تهيئة الثيم
  useEffect(() => {
    const savedTheme = localStorage.getItem('toolhub-theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    updateThemeIcon(initialTheme)
  }, [])

  // 🔼 زر العودة للأعلى
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 📱 إغلاق القائمة عند تغيير الحجم
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false)
        document.body.style.overflow = 'auto'
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // 🎨 تحديث أيقونة الثيم
  const updateThemeIcon = (theme: string) => {
    const themeIcon = document.querySelector('#themeToggle i')
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
    }
  }

  // ========== وظائف التحكم ==========

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('toolhub-theme', newTheme)
    updateThemeIcon(newTheme)
  }

  const openMobileMenu = () => {
    setMobileMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    closeMobileMenu()
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl('query', searchValue || null)
  }

  const handleCategoryFilter = (categoryId: string) => {
    updateUrl('category', categoryId === 'all' ? null : categoryId)
  }

  const handleSortChange = (value: string) => {
    updateUrl('sort', value)
  }

  const handlePageChange = (newPage: number) => {
    updateUrl('page', newPage.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewChange = (view: 'grid' | 'list') => {
    const container = document.getElementById('toolsGridContainer')
    if (container) {
      if (view === 'list') {
        container.classList.add('list-view')
      } else {
        container.classList.remove('list-view')
      }
    }
  }

  // ========== مكونات فرعية داخلية ==========

  const ThemeToggle = () => (
    <button 
      className="theme-toggle" 
      id="themeToggle" 
      onClick={toggleTheme}
      aria-label="تبديل وضع السطوع والظلام"
    >
      <i className="fas fa-moon"></i>
    </button>
  )

  const MobileMenuButton = () => (
    <button 
      className="mobile-menu-btn" 
      id="mobileMenuBtn" 
      onClick={openMobileMenu}
      aria-label="فتح قائمة التنقل"
    >
      <i className="fas fa-bars"></i>
    </button>
  )

  const MobileMenu = () => (
    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="mobile-menu-header">
        <button 
          className="close-mobile-menu" 
          onClick={closeMobileMenu}
          aria-label="إغلاق القائمة"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="mobile-menu-content">
        <ul className="mobile-nav-links">
          {['home', 'tools', 'categories', 'features', 'testimonials', 'contact'].map((section) => (
            <li key={section}>
              <button onClick={() => scrollToSection(section)}>
                {section === 'home' && 'الرئيسية'}
                {section === 'tools' && 'الأدوات'}
                {section === 'categories' && 'الفئات'}
                {section === 'features' && 'لماذا ToolHub؟'}
                {section === 'testimonials' && 'آراء المستخدمين'}
                {section === 'contact' && 'اتصل بنا'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const HeaderControls = () => (
    <div className="header-controls">
      <ThemeToggle />
      <MobileMenuButton />
    </div>
  )

  const SearchBar = () => (
    <form onSubmit={handleSearch} className="search-input-group">
      <input 
        type="text" 
        id="searchInput" 
        className="search-input" 
        placeholder="ما الذي تبحث عنه؟ اكتب اسم الأداة أو الفئة..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button type="submit" className="search-btn">
        <i className="fas fa-search"></i>
        بحث
      </button>
    </form>
  )

  const Filters = () => {
    const categories = [
      { id: 'all', label: 'الكل', icon: 'fas fa-th' },
      { id: 'writing', label: 'الكتابة', icon: 'fas fa-pen' },
      { id: 'design', label: 'التصميم', icon: 'fas fa-palette' },
      { id: 'video', label: 'الفيديو', icon: 'fas fa-video' },
      { id: 'code', label: 'البرمجة', icon: 'fas fa-code' },
      { id: 'marketing', label: 'التسويق', icon: 'fas fa-chart-line' },
      { id: 'business', label: 'الأعمال', icon: 'fas fa-briefcase' },
      { id: 'audio', label: 'الصوت', icon: 'fas fa-music' },
      { id: 'data', label: 'البيانات', icon: 'fas fa-database' },
      { id: 'other', label: 'أخرى', icon: 'fas fa-toolbox' }
    ]

    return (
      <div className="quick-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${category === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(cat.id)}
            aria-label={`فلترة بـ ${cat.label}`}
          >
            <i className={cat.icon}></i>
            {cat.label}
          </button>
        ))}
      </div>
    )
  }

  const SortSelect = () => (
    <div className="sort-options">
      <label htmlFor="sortSelect">ترتيب حسب:</label>
      <select 
        id="sortSelect" 
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="smart">الأذكى (مقترح)</option>
        <option value="rating">الأعلى تقييمًا</option>
        <option value="popular">الأكثر شعبية</option>
        <option value="newest">الأحدث</option>
      </select>
    </div>
  )

  const ViewToggle = () => {
    const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')

    return (
      <div className="view-toggle">
        <button 
          className={`view-btn ${activeView === 'grid' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('grid')
            handleViewChange('grid')
          }}
          aria-label="عرض الشبكة"
        >
          <i className="fas fa-th-large"></i>
          شبكة
        </button>
        <button 
          className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('list')
            handleViewChange('list')
          }}
          aria-label="عرض القائمة"
        >
          <i className="fas fa-list"></i>
          قائمة
        </button>
      </div>
    )
  }

  const BackToTop = () => (
    <button 
      className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  )

  // ========== RETURN كـ JSX (التعديل الأساسي) ==========

  return (
    <>
      <HeaderControls />
      <MobileMenu />
      <SearchBar />
      <Filters />
      <SortSelect />
      <ViewToggle />
      <BackToTop />
    </>
  )
}
