export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-brand">
          <span className="foot-mark">YC</span>
          <span className="deco">One IP, Many Possibilities.</span>
        </div>
        <nav className="foot-links" aria-label="页脚导航">
          <a href="#about">关于</a>
          <a href="#work">创作</a>
          <a href="#scenes">日常</a>
          <a href="#values">价值观</a>
          <a href="#find">找到我</a>
        </nav>
      </div>
      <div className="foot-meta">
        <p>© 2026 YC (Yi-Chen Lin) · 认真生活，浪漫创作 · Live sincerely, create romantically. ♥</p>
        <p className="foot-fine">
          YC 的视觉形象、插画与文字均为原创个人 IP，© 2026
          YC，未经许可请勿商用或二次分发。本站为静态个人主页，不收集任何个人数据、无追踪 Cookie。
        </p>
      </div>
      <a href="#top" className="totop">
        回到顶部 ↑
      </a>
    </footer>
  )
}
