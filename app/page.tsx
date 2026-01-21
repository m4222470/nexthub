import ClientApp from './ClientApp'

// ==============================
// 1️⃣ Type Definitions
// ==============================
interface Tool {
  id: number
  name: string
  description: string
  category: string
  price: number
  rating: number
  reviews: number
  featured: boolean
  website_url: string
  image_url: string
  created_at: string
  popular: boolean
  tags: string[]
}

interface Filters {
  query: string
  category: string
  sort: string
  page: number
}

// ==============================
// 2️⃣ Business Logic (Pure Functions)
// ==============================

// توليد النجوم كـ JSX بدلاً من HTML string
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="star-rating">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1
        if (starIndex <= Math.floor(rating)) {
          return <i key={index} className="fas fa-star" />
        } else if (starIndex === Math.ceil(rating) && rating % 1 > 0) {
          return <i key={index} className="fas fa-star-half-alt" />
        } else {
          return <i key={index} className="far fa-star" />
        }
      })}
    </div>
  )
}

// دوال الاشتقاق المركزية
function deriveIsFeatured(rating: number): boolean {
  return rating >= 4.5
}

function deriveIsPopular(rating: number): boolean {
  return rating >= 4.6
}

function deriveReviewsCount(rating: number, createdDate: string): number {
  const ratingScore = rating || 3.5
  const daysOld = (Date.now() - new Date(createdDate).getTime()) / (1000 * 60 * 60 * 24)

  // منطق ذكي للاشتقاق
  let reviews = 50 // الحد الأدنى

  if (ratingScore >= 4.7) {
    reviews = 2000 + Math.min(Math.floor(daysOld / 7) * 50, 5000)
  } else if (ratingScore >= 4.5) {
    reviews = 1000 + Math.min(Math.floor(daysOld / 7) * 30, 3000)
  } else if (ratingScore >= 4.0) {
    reviews = 500 + Math.min(Math.floor(daysOld / 7) * 20, 1500)
  } else if (ratingScore >= 3.5) {
    reviews = 100 + Math.min(Math.floor(daysOld / 7) * 10, 500)
  }

  return reviews
}

// أسماء الفئات
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'writing': 'الكتابة',
    'design': 'التصميم',
    'video': 'الفيديو',
    'code': 'البرمجة',
    'marketing': 'التسويق',
    'business': 'الأعمال',
    'audio': 'الصوت',
    'data': 'البيانات',
    'other': 'أخرى'
  }
  return categoryNames[category] || category
}

// أيقونات الفئات كـ JSX
function CategoryIcon({ category }: { category: string }) {
  const categoryIcons: Record<string, string> = {
    'writing': 'fas fa-pen',
    'design': 'fas fa-palette',
    'video': 'fas fa-video',
    'code': 'fas fa-code',
    'marketing': 'fas fa-chart-line',
    'business': 'fas fa-briefcase',
    'audio': 'fas fa-music',
    'data': 'fas fa-database',
    'other': 'fas fa-toolbox'
  }

  return <i className={categoryIcons[category] || 'fas fa-toolbox'} />
}

// حساب الدرجة الذكية
function getSmartScore(tool: Tool): number {
  let score = 0

  score += (tool.rating || 0) * 10

  if (tool.price === 0) score += 15

  // استخدام الحقول المشتقة
  const popularityScore = Math.min(Math.log10((tool.reviews || 0) + 1) * 5, 20)
  score += popularityScore

  if (tool.featured) score += 25

  if (tool.created_at) {
    const daysOld = (Date.now() - new Date(tool.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 30) {
      const newnessScore = Math.max(20 - daysOld, 0)
      score += newnessScore
    }
  }

  if (tool.popular) score += 20

  return Math.round(score)
}

// أسباب "Why This Tool"
function getWhyThisTool(tool: Tool): string[] {
  const reasons: string[] = []

  if (tool.rating >= 4.5) reasons.push("تقييم مرتفع")

  if (tool.price === 0) {
    reasons.push("مجانية بالكامل")
  } else if (tool.price < 20) {
    reasons.push("سعر معقول")
  }

  // استخدام الحقول المشتقة
  if (tool.reviews >= 1000) {
    reasons.push("شائعة جداً")
  } else if (tool.reviews >= 100) {
    reasons.push("مستخدمة من قبل العديد")
  }

  if (tool.featured) reasons.push("مميزة من فريق ToolHub")

  if (tool.description && (
    tool.description.includes("طلاب") || 
    tool.description.includes("تعليم") || 
    tool.description.includes("دراسة")
  )) {
    reasons.push("مناسبة للتعليم")
  }

  if (tool.created_at) {
    const daysOld = (Date.now() - new Date(tool.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 30) reasons.push("أداة جديدة")
  }

  return reasons.slice(0, 2)
}

// الحصول على الشارات كـ JSX
function ToolBadges({ tool }: { tool: Tool }) {
  const badges: Array<{text: string, type: string, icon: string}> = []

  if (tool.featured) {
    badges.push({ text: "مميزة", type: "featured", icon: "fas fa-crown" })
  }

  if (tool.price === 0) {
    badges.push({ text: "مجانية", type: "free", icon: "fas fa-gift" })
  }

  if (tool.popular) {
    badges.push({ text: "رائجة", type: "popular", icon: "fas fa-fire" })
  }

  if (tool.created_at) {
    const daysOld = (Date.now() - new Date(tool.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld < 30) {
      badges.push({ text: "جديدة", type: "new", icon: "fas fa-bolt" })
    }
  }

  return (
    <div className="tool-badges">
      {badges.map((badge, index) => (
        <span key={index} className={`tool-badge badge-${badge.type}`}>
          <i className={badge.icon}></i>
          {badge.text}
        </span>
      ))}
    </div>
  )
}

// فلترة الأدوات
function filterTools(tools: Tool[], filters: Filters): Tool[] {
  let results = [...tools]

  // فلترة بالنص
  if (filters.query && filters.query.trim()) {
    const terms = filters.query.toLowerCase().split(' ').filter(term => term.length > 0)
    results = results.filter(tool => {
      const searchable = (
        tool.name.toLowerCase() + ' ' +
        tool.description.toLowerCase()
      )
      return terms.every(term => searchable.includes(term))
    })
  }

  // فلترة بالفئة
  if (filters.category && filters.category !== 'all') {
    results = results.filter(tool => tool.category === filters.category)
  }

  // الترتيب
  switch (filters.sort) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'popular':
      results.sort((a, b) => {
        const aPopular = a.popular ? 1 : 0
        const bPopular = b.popular ? 1 : 0
        return bPopular - aPopular || b.reviews - a.reviews
      })
      break
    case 'newest':
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'smart':
    default:
      results.sort((a, b) => getSmartScore(b) - getSmartScore(a))
      break
  }

  return results
}

// استخراج التاغز من الوصف
function extractTags(description: string): string[] {
  if (!description || description.trim() === '') {
    return ['ذكاء اصطناعي', 'إنتاجية']
  }

  const tags = ['ذكاء اصطناعي', 'إنتاجية']
  const arabicStopWords = ['من', 'في', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك']

  const words = description
    .split(/\s+/)
    .map(word => word.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF0-9a-zA-Z]/g, ''))
    .filter(word => word.length > 2 && !arabicStopWords.includes(word))
    .slice(0, 5)

  tags.push(...words)

  return [...new Set(tags)].slice(0, 5)
}

// تكوين القوائم الموجهة
const BEST_LISTS_CONFIG = {
  writing: {
    title: "أفضل أدوات الذكاء الاصطناعي للكتابة والمحتوى",
    description: "مجموعة مختارة من أفضل أدوات الكتابة بالذكاء الاصطناعي لإنشاء محتوى متميز",
    icon: "fas fa-pen",
    color: "#667eea",
    filter: (tool: Tool) => tool.category === "writing" && tool.rating >= 4.3,
    limit: 7
  },
  free: {
    title: "أفضل أدوات الذكاء الاصطناعي المجانية",
    description: "أدوات ذكاء اصطناعي مجانية بالكامل لجميع المهام",
    icon: "fas fa-gift",
    color: "#10b981",
    filter: (tool: Tool) => tool.price === 0,
    limit: 9
  },
  students: {
    title: "أفضل أدوات الذكاء الاصطناعي للطلاب",
    description: "أدوات ذكاء اصطناعي مفيدة للطلاب والدراسة والتعلم",
    icon: "fas fa-graduation-cap",
    color: "#4facfe",
    filter: (tool: Tool) => 
      (tool.category === "writing" && tool.price === 0) ||
      (tool.description && (
        tool.description.includes("طلاب") || 
        tool.description.includes("تعليم") || 
        tool.description.includes("دراسة")
      )),
    limit: 6
  }
}

// ==============================
// 3️⃣ Data Fetching (Server Component) - المعدلة
// ==============================
async function getTools(): Promise<Tool[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

    // ✅ أمان محسن: التحقق من وجود المفاتيح
    if (!supabaseUrl || !supabaseKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Supabase credentials missing. Using fallback.')
        return []
      } else {
        throw new Error('Supabase credentials are required in production')
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/public_tools`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tools: ${response.status}`)
    }

    const tools = await response.json()

    // ✅ Normalize tools مع الاشتقاق الذكي
    return tools.map((tool: any) => {
      const rating = tool.rating || 3.5
      const description = tool.description || 'لا يوجد وصف متاح'
      const createdDate = tool.created_at || new Date().toISOString()

      // ✅ استخدام دوال الاشتقاق المركزية
      const reviewsCount = deriveReviewsCount(rating, createdDate)
      const isFeatured = deriveIsFeatured(rating)
      const isPopular = deriveIsPopular(rating)

      return {
        id: tool.id,
        name: tool.name || 'أداة بدون اسم',
        description: description,
        category: tool.category || 'other',
        price: tool.price || 0,
        rating: rating,
        reviews: reviewsCount,
        featured: isFeatured,
        website_url: tool.website_url || '#',
        image_url: tool.image_url || '',
        created_at: createdDate,
        popular: isPopular,
        tags: extractTags(description)
      }
    })

  } catch (error) {
    console.error('❌ فشل جلب الأدوات:', error)
    return []
  }
}

// ==============================
// 4️⃣ Page Component (Server Component)
// ==============================
export default async function HomePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // جلب البيانات
  const allTools = await getTools()

  // تحضير الفلاتر من URL
  const filters: Filters = {
    query: typeof searchParams.query === 'string' ? searchParams.query : '',
    category: typeof searchParams.category === 'string' ? searchParams.category : 'all',
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : 'smart',
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page) || 1 : 1
  }

  // تطبيق الفلترة والترتيب
  const filteredTools = filterTools(allTools, filters)

  // Pagination
  const PER_PAGE = 20
  const totalPages = Math.ceil(filteredTools.length / PER_PAGE)
  const startIndex = (filters.page - 1) * PER_PAGE
  const endIndex = startIndex + PER_PAGE
  const paginatedTools = filteredTools.slice(startIndex, endIndex)

  // إحصائيات
  const totalTools = allTools.length
  const freeTools = allTools.filter(t => t.price === 0).length
  const categoriesCount = [...new Set(allTools.map(t => t.category))].length

  // إنشاء Structured Data للـSEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://toolhub.ai/#website",
        "url": "https://toolhub.ai",
        "name": "ToolHub - أدوات الذكاء الاصطناعي",
        "description": "الوجهة العربية الأولى لاكتشاف أفضل أدوات الذكاء الاصطناعي",
        "inLanguage": "ar",
        "potentialAction": [{
          "@type": "SearchAction",
          "target": "https://toolhub.ai/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }]
      }
    ]
  }

  return (
    <>
      {/* Structured Data للـSEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Loading Overlay */}
      <div className="loading-overlay" id="loadingOverlay">
        <div className="loading-minimal">
          <div className="loading-logo-minimal">
            <i className="fas fa-robot logo-icon-3d"></i>
          </div>
          <div className="loading-text-minimal">
            <p>جاري تحميل العالم الذكي...</p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-element" style={{ width: '300px', height: '300px', top: '10%', right: '10%' }}></div>
      <div className="floating-element" style={{ width: '200px', height: '200px', bottom: '20%', left: '5%' }}></div>

      {/* Header */}
      <header>
        <a href="/" className="logo" aria-label="ToolHub - العودة للرئيسية">
          <i className="fas fa-robot logo-icon-3d"></i>
          <span>ToolHub</span>
        </a>

        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          <ul className="nav-links">
            <li><button data-section="home">الرئيسية</button></li>
            <li><button data-section="tools">الأدوات</button></li>
            <li><button data-section="categories">الفئات</button></li>
            <li><button data-section="about">من نحن</button></li>
            <li><button data-section="contact">اتصل بنا</button></li>
          </ul>
        </nav>

        <div className="header-controls">
          <button className="theme-toggle" id="themeToggle" aria-label="تبديل وضع السطوع والظلام">
            <i className="fas fa-moon"></i>
          </button>
          <button className="mobile-menu-btn" id="mobileMenuBtn" aria-label="فتح قائمة التنقل">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero-basic" id="home">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-gradient">ابدأ رحلتك مع أدوات الذكاء الاصطناعي</span>
            </h1>
            <p className="hero-subtitle">
              اكتشف أكثر من 1000 أداة ذكية في مكان واحد. من إنشاء المحتوى إلى تحليل البيانات، كل ما تحتاجه لمستقبل رقمي أفضل بلمسة ذكية.
            </p>

            <div className="hero-actions">
              <button id="exploreToolsBtn" className="hero-btn hero-primary">
                <i className="fas fa-rocket"></i>
                استكشاف الأدوات
              </button>
              <button id="watchDemoBtn" className="hero-btn hero-secondary">
                <i className="fas fa-play-circle"></i>
                مشاهدة العرض
              </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{totalTools}+</div>
                <div className="stat-label">أداة ذكية</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{freeTools}+</div>
                <div className="stat-label">مجانية بالكامل</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categoriesCount}+</div>
                <div className="stat-label">فئة مختلفة</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">مستخدم نشط</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section" id="search">
          <div className="container">
            <div className="search-container">
              <h2>ابحث عن الأداة المثالية</h2>
              <div className="search-input-group">
                <input 
                  type="text" 
                  id="searchInput" 
                  className="search-input" 
                  placeholder="ما الذي تبحث عنه؟ اكتب اسم الأداة أو الفئة..."
                  defaultValue={filters.query}
                />
                <button id="searchBtn" className="search-btn">
                  <i className="fas fa-search"></i>
                  بحث
                </button>
              </div>

              {/* Quick Filters */}
              <div className="quick-filters">
                <button className={`filter-btn ${filters.category === 'all' ? 'active' : ''}`} data-category="all">
                  الكل
                </button>
                <button className={`filter-btn ${filters.category === 'writing' ? 'active' : ''}`} data-category="writing">
                  <i className="fas fa-pen"></i>
                  الكتابة
                </button>
                <button className={`filter-btn ${filters.category === 'design' ? 'active' : ''}`} data-category="design">
                  <i className="fas fa-palette"></i>
                  التصميم
                </button>
                <button className={`filter-btn ${filters.category === 'video' ? 'active' : ''}`} data-category="video">
                  <i className="fas fa-video"></i>
                  الفيديو
                </button>
                <button className={`filter-btn ${filters.category === 'code' ? 'active' : ''}`} data-category="code">
                  <i className="fas fa-code"></i>
                  البرمجة
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="tools-section" id="tools">
          <div className="container">
            <div className="section-header">
              <h2>الأدوات المميزة</h2>
              <p>اكتشف أفضل أدوات الذكاء الاصطناعي المختارة بعناية</p>

              <div className="view-toggle">
                <button id="gridViewBtn" className="view-btn active">
                  <i className="fas fa-th-large"></i>
                  شبكة
                </button>
                <button id="listViewBtn" className="view-btn">
                  <i className="fas fa-list"></i>
                  قائمة
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="results-info">
              <div className="results-count">
                <span>{paginatedTools.length}</span>
                <span> أداة معروضة من أصل </span>
                <span>{filteredTools.length}</span>
              </div>
              <div className="results-controls">
                <div className="sort-options">
                  <label htmlFor="sortSelect">ترتيب حسب:</label>
                  <select id="sortSelect" defaultValue={filters.sort}>
                    <option value="smart">الأذكى (مقترح)</option>
                    <option value="featured">الأكثر تميزًا</option>
                    <option value="rating">الأعلى تقييمًا</option>
                    <option value="popular">الأكثر شعبية</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn prev-btn" 
                    id="prevPageBtn" 
                    disabled={filters.page <= 1}
                  >
                    <i className="fas fa-chevron-right"></i>
                    السابق
                  </button>
                  <div className="page-numbers" id="pageNumbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button 
                          key={pageNum} 
                          className={`page-number ${pageNum === filters.page ? 'active' : ''}`}
                          data-page={pageNum}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button 
                    className="pagination-btn next-btn" 
                    id="nextPageBtn" 
                    disabled={filters.page >= totalPages}
                  >
                    التالي
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div id="toolsGridContainer" className="tools-grid-container">
              {paginatedTools.map((tool) => {
                const whyReasons = getWhyThisTool(tool)
                const smartScore = getSmartScore(tool)

                return (
                  <div className="tool-card" key={tool.id} data-tool-id={tool.id}>
                    {tool.featured && (
                      <div className="featured-badge">
                        <i className="fas fa-crown"></i> مميز
                      </div>
                    )}

                    {tool.popular && (
                      <div className="popular-badge">
                        <i className="fas fa-fire"></i> رائج
                      </div>
                    )}

                    <div className="tool-card-header">
                      <div className="tool-icon">
                        <CategoryIcon category={tool.category} />
                      </div>

                      {tool.image_url && (
                        <div className="tool-image-container">
                          <img 
                            src={tool.image_url} 
                            alt={tool.name}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}

                      <div className="tool-header-content">
                        <h3 className="tool-title">{tool.name}</h3>
                        <ToolBadges tool={tool} />
                        <span className="tool-category">{getCategoryName(tool.category)}</span>
                      </div>
                    </div>

                    <div className="tool-card-body">
                      <p className="tool-description">{tool.description}</p>

                      {whyReasons.length > 0 && (
                        <div className="why-section">
                          <span className="why-title">💡 لماذا هذه الأداة؟</span>
                          <ul className="why-list">
                            {whyReasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="tool-tags">
                        {tool.tags.map((tag, index) => (
                          <span key={index} className="tool-tag">#{tag}</span>
                        ))}
                      </div>

                      <div className="tool-rating">
                        <StarRating rating={tool.rating} />
                        {tool.reviews > 0 && (
                          <span className="review-count">({tool.reviews.toLocaleString('ar-SA')})</span>
                        )}
                        <span className="smart-score" title="الدرجة الذكية">
                          <i className="fas fa-brain"></i> {smartScore}
                        </span>
                      </div>
                    </div>

                    <div className="tool-card-footer">
                      <span className={`tool-price ${tool.price === 0 ? 'free' : ''}`}>
                        {tool.price === 0 ? 'مجاني' : `$${tool.price}/شهر`}
                      </span>
                      <a 
                        href={tool.website_url} 
                        className="tool-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>استكشاف</span>
                        <i className="fas fa-arrow-left"></i>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Footer */}
            <div className="pagination-footer">
              <div className="pagination-info">
                الصفحة <span>{filters.page}</span> من <span>{totalPages}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section" id="categories">
          <div className="container">
            <div className="section-header">
              <h2>تصفح حسب الفئات</h2>
              <p>اكتشف الأدوات من خلال التصنيفات المحددة</p>
            </div>

            <div className="categories-grid">
              {Array.from(new Set(allTools.map(t => t.category))).slice(0, 6).map((category) => {
                const categoryCount = allTools.filter(t => t.category === category).length
                return (
                  <div className="category-card" key={category} data-category={category}>
                    <div className="category-icon">
                      <CategoryIcon category={category} />
                    </div>
                    <h3>{getCategoryName(category)}</h3>
                    <span className="category-count">{categoryCount} أداة</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section" id="features">
          <div className="container">
            <div className="section-header">
              <h2>لماذا ToolHub؟</h2>
              <p>مزايا تجعلنا الوجهة الأولى لأدوات الذكاء الاصطناعي</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <h3>ذكاء اصطناعي حقيقي</h3>
                <p>أدوات مختارة بعناية تعمل بتقنيات الذكاء الاصطناعي الحديثة</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-filter"></i>
                </div>
                <h3>فلترة ذكية</h3>
                <p>ابحث عن الأداة المثالية بسرعة باستخدام فلاتر متقدمة</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-language"></i>
                </div>
                <h3>واجهة عربية</h3>
                <p>منصة بالكامل باللغة العربية لتسهيل الاستخدام</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section" id="testimonials">
          <div className="container">
            <div className="section-header">
              <h2>آراء المستخدمين</h2>
              <p>ماذا يقولون عن منصتنا</p>
            </div>

            <div className="testimonials-slider">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "ToolHub وفر لي ساعات من البحث. وجدت أداة الذكاء الاصطناعي المثالية لمشروعي خلال دقائق!"
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">أ</div>
                  <div>
                    <h4>أحمد محمد</h4>
                    <p>مطور ويب</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  "كمصمم، كنت أبحث عن أدوات تصميم بالذكاء الاصطناعي. ToolHub جمع لي كل الأدوات في مكان واحد!"
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">س</div>
                  <div>
                    <h4>سارة علي</h4>
                    <p>مصممة جرافيك</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" id="cta">
          <div className="container">
            <div className="cta-content">
              <h2>جاهز لاكتشاف عالم الذكاء الاصطناعي؟</h2>
              <p>انضم إلى آلاف المستخدمين الذين يعتمدون على ToolHub لإيجاد أفضل الأدوات</p>
              <button className="cta-btn">
                <i className="fas fa-rocket"></i>
                ابدأ الآن مجانًا
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-column">
                <h3>ToolHub</h3>
                <p>الوجهة العربية الأولى لاكتشاف أفضل أدوات الذكاء الاصطناعي</p>
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="تويتر">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="فيسبوك">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="لينكدإن">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="انستغرام">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>

              <div className="footer-column">
                <h3>روابط سريعة</h3>
                <ul className="footer-links">
                  <li><button>الرئيسية</button></li>
                  <li><button>الأدوات</button></li>
                  <li><button>الفئات</button></li>
                  <li><button>من نحن</button></li>
                  <li><button>اتصل بنا</button></li>
                </ul>
              </div>

              <div className="footer-column">
                <h3>اشترك في النشرة البريدية</h3>
                <p>احصل على آخر التحديثات عن أدوات الذكاء الاصطناعي</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="بريدك الإلكتروني" />
                  <button type="submit">اشتراك</button>
                </div>
              </div>
            </div>

            <div className="copyright">
              <p>© {new Date().getFullYear()} ToolHub. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <button className="back-to-top" id="backToTop" aria-label="العودة للأعلى">
          <i className="fas fa-arrow-up"></i>
        </button>
      </main>

      {/* Client Component للتفاعلات فقط */}
      <ClientApp />
    </>
  )
}
