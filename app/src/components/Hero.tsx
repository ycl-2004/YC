import { asset } from '../lib/asset'

export default function Hero() {
  return (
    <header className="hero">
      <div className="aurora" aria-hidden="true">
        <span className="a1"></span>
        <span className="a2"></span>
        <span className="a3"></span>
      </div>
      <span className="hero-bgword" data-parallax="0.25" aria-hidden="true">
        YC
      </span>

      <div className="hero-left">
        <p className="eyebrow">
          Personal IP <span className="dot"></span> <span>Build · Share · Inspire</span>
        </p>
        <h1 className="serif">
          你好，
          <br />我是 <span className="name name-shine">YC</span>
        </h1>
        <p className="hero-roles deco">
          a{' '}
          <span className="rot" id="rotator">
            creator
          </span>
        </p>
        <p className="hero-intro">
          一个在 AI 时代<b>认真生活、浪漫创作</b>
          的人。写代码、做设计、写音乐、读书、到处走走——把混乱的想法，变成有价值、有温度的东西。
        </p>
        <div className="hero-actions">
          <a href="#work" className="btn btn-primary shimmer" data-magnetic>
            看我在创作什么 <span className="ar">↓</span>
          </a>
          <a href="#find" className="btn btn-ghost" data-magnetic>
            找到我 <span className="ar">→</span>
          </a>
        </div>
          <div className="hero-stats">
            <div className="st">
              <div className="n" data-count="5">
                0
              </div>
              <div className="l">
                <span>创作方向</span>
                <i aria-hidden="true">·</i>
                <span className="stat-en">directions</span>
              </div>
            </div>
            <div className="st">
              <div className="n" data-count="8">
                0
              </div>
              <div className="l">
                <span>性格标签</span>
                <i aria-hidden="true">·</i>
                <span className="stat-en">traits</span>
              </div>
            </div>
            <div className="st">
              <div className="n">∞</div>
              <div className="l">
                <span>可能性</span>
                <i aria-hidden="true">·</i>
                <span className="stat-en">possibilities</span>
              </div>
            </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="figure-stage" id="figStage">
          <div className="fig-ring"></div>
          <div className="fig-ring r2"></div>
          <div className="fig-disc"></div>
          <span className="fig-beam" aria-hidden="true"></span>
          <img
            className="fig-img"
            src={asset('assets/stickers/pose-standing.png')}
            alt="YC 本人 · 酒红乱发 + 透明圆框眼镜 + 牛仔外套的 chibi 形象"
          />
          <span className="fig-heart" aria-hidden="true">
            ♥
          </span>
          <div className="fig-badges" aria-label="YC 的兴趣标签">
            <span className="fig-badge b1">
              <span className="e">⌨️</span>coding
            </span>
            <span className="fig-badge b2">
              <span className="e">♪</span>music
            </span>
            <span className="fig-badge b3">
              <span className="e">📚</span>always learning
            </span>
          </div>
          <span className="fig-note script">红发 + 眼镜，认准我</span>
        </div>
      </div>

      <div className="scrollcue" aria-hidden="true">
        <span>scroll</span>
        <span className="line"></span>
      </div>
    </header>
  )
}
