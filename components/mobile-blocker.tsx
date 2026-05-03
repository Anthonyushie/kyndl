"use client"

import { useEffect, useState } from "react"

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <div className="mobile-blocker-overlay">
      {/* Animated background particles */}
      <div className="blocker-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="blocker-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      {/* Glowing rings */}
      <div className="blocker-rings">
        <div className="blocker-ring blocker-ring-1" />
        <div className="blocker-ring blocker-ring-2" />
        <div className="blocker-ring blocker-ring-3" />
      </div>

      {/* Content */}
      <div className="blocker-content">
        <div className="blocker-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <h2 className="blocker-title">Desktop Only</h2>

        <p className="blocker-text">
          Kyndl is optimized for desktop experiences.<br />
          Please switch to a larger screen to continue.
        </p>

        <div className="blocker-divider" />

        <div className="blocker-min-width">
          <span className="blocker-badge">min-width: 768px</span>
        </div>
      </div>
    </div>
  )
}
