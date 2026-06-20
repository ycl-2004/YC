import { sceneData } from '../data'
import { asset } from '../lib/asset'

export default function Scenes() {
  // Cards are rendered twice so the JS auto-scroll can loop seamlessly.
  const cards = [...sceneData, ...sceneData]
  return (
    <section className="scenes pad" id="scenes">
      <div className="container">
        <div className="scenes-head reveal">
          <div>
            <span className="sec-num">04</span>
            <h2 className="sec-title serif">我的日常切片</h2>
          </div>
          <p className="sec-sub" style={{ margin: 0 }}>
            同一个红发眼镜的 YC，出现在咖啡馆、音乐房、书店、城市与日落里。
            <span className="deco">A day in YC's world.</span>
            <br />
            <span className="scene-hint">← 拖动浏览 · 点击放大 →</span>
          </p>
        </div>
      </div>
      <div className="scene-row reveal reveal-d1" id="sceneRow">
        <div className="scene-track" id="sceneTrack">
          {cards.map((s, idx) => {
            const i = idx % sceneData.length
            return (
              <figure className="scene-card" data-i={i} key={idx}>
                <img
                  src={asset(`assets/scenes/${s[0]}.jpg`)}
                  alt={`YC 场景 · ${s[2]}`}
                  draggable={false}
                  loading="lazy"
                />
                <span className="zoomhint" aria-hidden="true">
                  ⤢
                </span>
                <figcaption className="cap">
                  {s[1]}
                  <span className="zh">{s[2]}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
