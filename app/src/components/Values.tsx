import { asset } from '../lib/asset'

const values: [string, string, string][] = [
  ['01', '好奇心', 'Curiosity'],
  ['02', '善意', 'Kindness'],
  ['03', '创造力', 'Creativity'],
  ['04', '自律', 'Discipline'],
  ['05', '价值', 'Impact'],
  ['06', '成长', 'Growth'],
]

const delay = (i: number) => `reveal-d${Math.floor(i / 2) + 1}`

export default function Values() {
  return (
    <section className="values pad" id="values">
      <div className="meteors" id="meteors" aria-hidden="true"></div>
      <img
        className="values-float reveal"
        src={asset('assets/stickers/pose-thinking.png')}
        alt=""
        aria-hidden="true"
      />
      <div className="container">
        <div className="values-head reveal">
          <span className="sec-num">05</span>
          <h2 className="sec-title serif">我看重什么</h2>
          <span className="en">What I value</span>
        </div>
        <div className="value-grid">
          {values.map(([num, zh, en], i) => (
            <div className={`value reveal ${delay(i)}`} key={num}>
              <span className="num">{num}</span>
              <span className="zh">{zh}</span>
              <span className="en2">{en}</span>
            </div>
          ))}
        </div>
        <p className="values-quote reveal reveal-d2">
          「Ideas are easy. <em>Building</em> is where the magic happens.」
        </p>
      </div>
    </section>
  )
}
