import { asset } from '../lib/asset'

export default function NameCardModal() {
  return (
    <div className="cardmodal" id="cardModal" role="dialog" aria-modal="true" aria-label="YC 名片">
      <div className="cardmodal-backdrop" data-close></div>
      <div className="cardmodal-inner">
        <div className="namecard" id="nameCard">
          <div className="nc-top">
            <span className="nc-eyebrow">Personal IP · 名片</span>
            <span className="nc-mark">YC</span>
          </div>
          <span className="nc-side nc-side-l" aria-hidden="true">
            · ONE IP ·
          </span>
          <span className="nc-side nc-side-r" aria-hidden="true">
            · MANY POSSIBILITIES ·
          </span>
          <div className="nc-figure">
            <span className="nc-halo" aria-hidden="true"></span>
            <img className="nc-char" src={asset('assets/stickers/nc-char.png')} alt="YC 头像" />
          </div>
          <div className="nc-namewrap">
            <span className="nc-div" aria-hidden="true"></span>
            <h3 className="nc-name serif">YC</h3>
            <span className="nc-div" aria-hidden="true"></span>
          </div>
          <p className="nc-roles">creator · engineer · dreamer</p>
          <p className="nc-tag">
            认真生活，<b>浪漫创作</b>
          </p>
          <p className="nc-tag-en">Live sincerely, create romantically.</p>
          <div className="nc-pillars">
            <span className="t-ai">AI</span>
            <i className="nc-sep">·</i>
            <span className="t-design">Design</span>
            <i className="nc-sep">·</i>
            <span className="t-music">♪ Music</span>
            <i className="nc-sep">·</i>
            <span className="t-books">Books</span>
            <i className="nc-sep">·</i>
            <span className="t-life">🌿 Life</span>
          </div>
          <div className="nc-social">小红书 · Instagram · 微信 · LinkedIn · 抖音</div>
          <div className="nc-barwrap">
            <span className="nc-bar"></span>
            <span className="nc-bar-heart" aria-hidden="true">
              ♥
            </span>
          </div>
          <div className="nc-foot">© 2026 YC (Yi-Chen Lin) · One IP, Many Possibilities</div>
        </div>
        <div className="cardmodal-actions">
          <button type="button" className="btn btn-primary" id="dlCard" data-magnetic>
            下载名片 PNG <span className="ar">↓</span>
          </button>
          <button type="button" className="btn btn-ghost" id="copyLink" data-magnetic>
            复制主页链接
          </button>
          <button type="button" className="btn btn-ghost" id="closeCard" data-close>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
