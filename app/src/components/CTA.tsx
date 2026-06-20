import { asset } from '../lib/asset'

const platforms = [
  {
    number: '01',
    label: '小红书',
    description: 'AI 工具、个人系统、创作记录',
    href: 'https://xhslink.com/m/AjbMXadUQu2',
  },
  {
    number: '02',
    label: 'Instagram',
    description: '视觉日记、音乐、城市漫步',
    href: 'https://www.instagram.com/linyc_04?igsh=bW0wbG84aWk4dmow&utm_source=qr',
  },
  { number: '03', label: '微信', description: '更近一点的近况与交流', wechatId: 'y1chnlyn' },
  { number: '04', label: 'LinkedIn', description: '项目、职业思考、成长记录' },
  { number: '05', label: '抖音', description: 'AI 实测、创作过程、日常短片' },
]

export default function CTA() {
  return (
    <section className="cta pad" id="find">
      <span className="cta-bgword" aria-hidden="true">
        say hi
      </span>
      <div className="cta-hearts" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="0 0 24 24">
            <path d="M12 21s-7-4.4-9.6-9C.8 8.9 2.4 5.5 6 5.5c2 0 3.3 1.2 4 2.4.7-1.2 2-2.4 4-2.4 3.6 0 5.2 3.4 3.6 6.5C19 16.6 12 21 12 21Z" />
          </svg>
        ))}
      </div>
      <div className="container cta-inner">
        <img
          className="cta-avatar reveal"
          src={asset('assets/stickers/pose-standing.png')}
          alt="YC · 酒红乱发 + 透明圆框眼镜 + 牛仔外套的 chibi 形象"
        />
        <h2 className="serif reveal">
          在不同的地方，看到不同的 <em>YC</em>
        </h2>
        <p className="lead reveal reveal-d1">同一个人，五种更合适的相遇方式。</p>
        <ol className="social-map reveal reveal-d2" aria-label="YC 的社交媒体内容地图">
          {platforms.map((platform) => (
            <li key={platform.label}>
              <span className="social-num" aria-hidden="true">
                {platform.number}
              </span>
              <strong>
                {platform.href ? (
                  <a href={platform.href} target="_blank" rel="noreferrer" data-magnetic>
                    {platform.label} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  platform.label
                )}
              </strong>
              <span>
                {platform.description}
                {platform.wechatId && (
                  <button type="button" className="wechat-copy" id="copyWechat" data-wechat-id={platform.wechatId}>
                    复制 {platform.wechatId}
                  </button>
                )}
              </span>
            </li>
          ))}
        </ol>
        <aside className="collab-note reveal reveal-d3" aria-label="合作方向">
          <span className="deco">Work with YC</span>
          <p>AI 与创作者工具 · 学习与效率工具 · 设计、音乐与生活方式内容</p>
          <small>图文分享 · 短视频 · 产品体验 · 教学内容 · build log</small>
        </aside>
        <button type="button" className="btn-finale shimmer reveal reveal-d3" id="shareProfile" data-magnetic>
          分享这张 YC 名片 <span className="ar">→</span>
        </button>
        <p className="cta-note reveal reveal-d4">期待和你相遇</p>
      </div>
    </section>
  )
}
