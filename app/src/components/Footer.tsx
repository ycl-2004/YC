// Shared site footer. Layout adapted from a 21st.dev footer block (brand left /
// social right, divider, main + legal link rows, copyright) but rebuilt with the
// project's own CSS classes + colour tokens — no shadcn / cva / radix / lucide.
// Used on the home page and the standalone /privacy + /terms pages, so every link
// is page-relative (`./...`) to work from any entry and from the /YC/ subpath.

const socialLinks = [
  {
    label: '小红书',
    href: 'https://xhslink.com/m/AjbMXadUQu2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/linyc_04?igsh=bW0wbG84aWk4dmow&utm_source=qr',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: '更多联系方式',
    href: './#find',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

const mainLinks = [
  { href: './#about', label: '关于' },
  { href: './#now', label: '最近' },
  { href: './#work', label: '创作' },
  { href: './#scenes', label: '日常' },
  { href: './#values', label: '价值观' },
  { href: './#find', label: '关注 YC' },
  { href: 'https://ycl-2004.github.io/Profile/', label: 'Profile ↗' },
]

const legalLinks = [
  { href: './privacy.html', label: '隐私 · Privacy' },
  { href: './terms.html', label: '条款 · Terms' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-wrap">
        <div className="foot-top">
          <a className="foot-brand" href="./" aria-label="YC 首页">
            <span className="foot-mark">YC</span>
            <span className="foot-brandname">
              YC<em>·</em>One IP, Many Possibilities.
            </span>
          </a>
          <a href="#top" className="foot-totop">
            回到顶部 ↑
          </a>

          <ul className="foot-social" aria-label="社交媒体">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="foot-social-btn"
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-grid">
          <nav className="foot-main" aria-label="页脚导航">
            <ul>
              {mainLinks.map((link) => {
                const external = link.href.startsWith('http')
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <nav className="foot-legal" aria-label="法律信息">
            <ul>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="foot-copy">
            <p className="foot-tagline deco">
              认真生活，浪漫创作 · Live sincerely, create romantically. ♥
            </p>
            <p>© 2026 YC (Yi-Chen Lin)</p>
            <p className="foot-fine">
              YC 的视觉形象、插画与文字均为原创个人 IP，未经许可请勿商用或二次分发。本站为静态个人主页，不收集任何个人数据、无追踪 Cookie。
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
