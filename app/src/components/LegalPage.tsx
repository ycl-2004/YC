import type { ReactNode } from 'react'
import Footer from './Footer'

// Lightweight shell for the standalone /privacy and /terms pages. Intentionally
// does NOT mount the home page's imperative effects (cursor, parallax, meteors) —
// legal pages should stay simple and fast. Just a back-to-home bar, the article,
// and the shared Footer.
interface LegalPageProps {
  titleZh: string
  titleEn: string
  updated: string
  children: ReactNode
}

export default function LegalPage({ titleZh, titleEn, updated, children }: LegalPageProps) {
  return (
    <div className="legal-page">
      <span id="top"></span>
      <header className="legal-topbar">
        <a className="brand" href="./" aria-label="返回 YC 首页">
          <span className="mk">YC</span>
        </a>
        <a className="legal-back" href="./">
          ← 返回首页 Home
        </a>
      </header>

      <main className="legal-main">
        <h1>{titleZh}</h1>
        <p className="legal-sub">{titleEn}</p>
        <p className="legal-updated">最后更新 Last updated · {updated}</p>
        {children}
      </main>

      <Footer />
    </div>
  )
}
