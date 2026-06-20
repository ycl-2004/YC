export default function Nav() {
  return (
    <nav className="nav" id="nav">
      <a className="brand" href="#top" aria-label="YC 首页">
        <span className="mk">YC</span>
        <span className="tag">认真生活，浪漫创作</span>
      </a>
      <div className="navlinks" id="navlinks">
        <a href="#about">关于</a>
        <a href="#work">创作</a>
        <a href="#scenes">日常</a>
        <a href="#values">价值观</a>
      </div>
      <a href="#find" className="nav-cta" data-magnetic>
        找到我 →
      </a>
    </nav>
  )
}
