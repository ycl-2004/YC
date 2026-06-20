import { asset } from '../lib/asset'

const platforms: [string, string][] = [
  ['小红书', '小红书'],
  ['B站', 'B 站'],
  ['YouTube', 'YouTube'],
  ['Instagram', 'Instagram'],
  ['Twitter/X', 'Twitter / X'],
  ['LinkedIn', 'LinkedIn'],
]

export default function CTA() {
  return (
    <section className="cta pad" id="find">
      <span className="cta-bgword" aria-hidden="true">
        say hi
      </span>
      <div className="container cta-inner">
        <img
          className="cta-avatar reveal"
          src={asset('assets/stickers/pose-standing.png')}
          alt="YC · 酒红乱发 + 透明圆框眼镜 + 牛仔外套的 chibi 形象"
        />
        <h2 className="serif reveal">
          一起<em>创作</em>点什么吧
        </h2>
        <p className="lead reveal reveal-d1">在这些地方，你能找到正在 build &amp; share 的我 ↓</p>
        <div className="platforms reveal reveal-d2">
          {platforms.map(([edit, label]) => (
            <a href="#" data-magnetic data-edit={edit} key={edit}>
              <span className="dot"></span>
              {label}
            </a>
          ))}
        </div>
        <button type="button" className="btn-finale shimmer reveal reveal-d3" id="shareProfile" data-magnetic>
          分享这张 YC 名片 <span className="ar">→</span>
        </button>
        <p className="cta-note reveal reveal-d4">期待和你相遇</p>
      </div>
    </section>
  )
}
