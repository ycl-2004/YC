import { asset } from '../lib/asset'

type MotionPortraitProps = {
  variant: 'ai' | 'design' | 'music' | 'read' | 'photo'
  animatedSrc: string
  staticSrc: string
  alt: string
}

function MotionPortrait({ variant, animatedSrc, staticSrc, alt }: MotionPortraitProps) {
  return (
    <button type="button" className={`motion-portrait motion-${variant}`} aria-label="放大查看角色动画">
      <picture className="motion-picture">
        <source media="(prefers-reduced-motion: reduce)" srcSet={asset(staticSrc)} />
        <img className="pillar-img" src={asset(animatedSrc)} alt={alt} loading="lazy" />
      </picture>
    </button>
  )
}

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
            <MotionPortrait
              variant="ai"
              animatedSrc="assets/animate_svg/img_1/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_1/frames/frame_01.png?v=4"
              alt="YC 坐着使用笔记本电脑写代码和构建 AI 工具"
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
            <MotionPortrait
              variant="design"
              animatedSrc="assets/animate_svg/img_2/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_2/frames/frame_01.png?v=4"
              alt="YC 在笔记本上写字，记录灵感和规划想法"
            />
          </div>
          <div className="pillar reveal reveal-d3">
            <span className="pillar-bgnum">3</span>
            <span className="emoji">♪</span>
            <span className="en">Music &amp; Creativity</span>
            <h3>用音乐表达情绪</h3>
            <div className="kw">
              <span>Beat Making</span>
              <span>Keys</span>
              <span>Mood</span>
            </div>
            <MotionPortrait
              variant="music"
              animatedSrc="assets/animate_svg/img_6/animation.svg?v=7"
              staticSrc="assets/animate_svg/img_6/frames/frame_01.png?v=7"
              alt="YC 坐着弹木吉他，投入地创作音乐"
            />
          </div>
          <div className="pillar span2 reveal reveal-d1">
            <MotionPortrait
              variant="read"
              animatedSrc="assets/animate_svg/img_4/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_4/frames/frame_01.png?v=4"
              alt="YC 坐在一摞书上专注阅读"
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
            <MotionPortrait
              variant="photo"
              animatedSrc="assets/animate_svg/img_5/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_5/frames/frame_01.png?v=4"
              alt="YC 穿橄榄色外套拿着相机记录生活"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
