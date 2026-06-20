import { asset } from '../lib/asset'

export default function Work() {
  return (
    <section className="pad" id="work">
      <div className="container">
        <div className="pillars-head reveal">
          <span className="sec-num">02</span>
          <h2 className="sec-title serif">我在创作什么</h2>
          <p className="sec-sub">
            五个方向，一个 YC。<span className="deco">One IP, Many Possibilities.</span>
          </p>
        </div>
        <div className="pillar-grid">
          <div className="pillar reveal reveal-d1">
            <span className="pillar-bgnum">1</span>
            <span className="emoji">⌨️</span>
            <span className="en">AI &amp; Coding</span>
            <h3>思考 · 构建 · 解决</h3>
            <div className="kw">
              <span>AI Tools</span>
              <span>Automation</span>
              <span>No-code</span>
              <span>Web Dev</span>
            </div>
            <img
              className="pillar-img"
              src={asset('assets/stickers/pose-thinking.png')}
              alt="YC 在思考，旁边有 AI 对话气泡"
              loading="lazy"
            />
          </div>
          <div className="pillar reveal reveal-d2">
            <span className="pillar-bgnum">2</span>
            <svg className="spark s1" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" />
            </svg>
            <svg className="spark s2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" />
            </svg>
            <span className="emoji">💡</span>
            <span className="en">Design &amp; Ideas</span>
            <h3>记录灵感，规划未来</h3>
            <div className="kw">
              <span>Visual Design</span>
              <span>Brand</span>
              <span>Content</span>
            </div>
            <img
              className="pillar-img"
              src={asset('assets/stickers/v-draw.png')}
              alt="YC 穿蓝色卫衣在平板上画草图、记录灵感"
              loading="lazy"
            />
          </div>
          <div className="pillar reveal reveal-d3">
            <span className="pillar-bgnum">3</span>
            <span className="emoji">♪</span>
            <span className="en">Music &amp; Creativity</span>
            <h3>用音乐表达情绪</h3>
            <div className="kw">
              <span>Beat Making</span>
              <span>Covers</span>
              <span>Mood</span>
            </div>
            <img
              className="pillar-img"
              src={asset('assets/stickers/v-guitar.png')}
              alt="YC 抱着吉他弹唱、创作音乐"
              loading="lazy"
            />
          </div>
          <div className="pillar span2 reveal reveal-d1">
            <img
              className="pillar-img"
              src={asset('assets/stickers/v-reading-books.png')}
              alt="YC 坐在一摞书上专注阅读"
              loading="lazy"
            />
            <div className="p-body">
              <span className="emoji">📚</span>
              <span className="en">Learning &amp; Books</span>
              <h3>保持好奇，持续升级</h3>
              <div className="kw">
                <span>Mindset</span>
                <span>Business</span>
                <span>Psychology</span>
                <span>Growth</span>
                <span>Keep Learning</span>
              </div>
            </div>
          </div>
          <div className="pillar reveal reveal-d2">
            <span className="pillar-bgnum">5</span>
            <span className="emoji">🌿</span>
            <span className="en">Lifestyle &amp; Outdoor</span>
            <h3>享受生活，保持热爱</h3>
            <div className="kw">
              <span>City Walks</span>
              <span>Nature</span>
              <span>Slow Living</span>
            </div>
            <img
              className="pillar-img"
              src={asset('assets/stickers/v-camera.png')}
              alt="YC 穿橄榄色外套拿着相机记录生活"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
