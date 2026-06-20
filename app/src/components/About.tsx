import { asset } from '../lib/asset'

const traits: [string, string][] = [
  ['温暖友善', 'warm'],
  ['灵感很多', 'ideas'],
  ['真诚投入', 'sincere'],
  ['工程思维', 'builder mind'],
  ['热爱音乐', 'music'],
  ['浪漫主义者', 'romantic'],
  ['梦想家', 'dreamer'],
  ['一直在成长', 'always becoming'],
]

const outfits: [string, string][] = [
  ['outfit-01', 'YC 黑色西装外套造型'],
  ['outfit-06', 'YC 白色毛衣造型'],
  ['outfit-05', 'YC 格纹衬衫造型'],
  ['outfit-04', 'YC 橄榄绿马甲造型，比 V 手势'],
  ['outfit-09', 'YC 牛仔休闲造型'],
]

export default function About() {
  return (
    <section className="about pad" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="reveal">
            <span className="sec-num">01</span>
            <h2 className="sec-title serif">关于我</h2>
            <p>
              我相信 <span className="hl">理性</span> 和 <span className="hl-d">浪漫</span>{' '}
              可以共存：用工程思维把事情做扎实，也让浪漫感受留在作品里。
            </p>
            <p>恋爱脑，但也很上进。认真对待每一段关系、每一个想法，和每一行代码。</p>
            <p>
              不追求完美，只追求一直在路上：<span className="hl-b">Progress &gt; Perfection.</span>
            </p>
            <span className="about-sign script">— 这就是 YC ♥</span>
          </div>
          <div className="reveal reveal-d1">
            <div className="tagcloud" aria-label="YC 的八个性格侧面">
              {traits.map(([zh, en], index) => (
                <span className="trait" data-trait={String(index + 1).padStart(2, '0')} key={en}>
                  <b>{zh}</b>
                  <span className="en">{en}</span>
                </span>
              ))}
            </div>
            <div className="wardrobe">
              <p className="lbl script">
                同一个 <b>YC</b>，很多面；换身衣服，还是我 →
              </p>
              <div className="ward-rail">
                {outfits.map(([file, alt]) => (
                  <img key={file} src={asset(`assets/stickers/${file}.png`)} alt={alt} loading="lazy" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
