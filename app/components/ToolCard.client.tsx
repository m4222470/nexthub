'use client'

interface ToolCardProps {
  tool: any
  whyReasons: string[]
  smartScore: number
  categoryName: string
  badges: Array < { text: string;type: string;icon: string } >
}

export default function ToolCard({ tool, whyReasons, smartScore, categoryName, badges }: ToolCardProps) {
  return (
    <div className="tool-card">
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
          <i className="fas fa-robot"></i>
        </div>
        
        <div className="tool-header-content">
          <h3 className="tool-title">{tool.name}</h3>
          <div className="tool-badges">
            {badges.map((badge, index) => (
              <span key={index} className={`tool-badge badge-${badge.type}`}>
                <i className={badge.icon}></i>
                {badge.text}
              </span>
            ))}
          </div>
          <span className="tool-category">{categoryName}</span>
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
}
