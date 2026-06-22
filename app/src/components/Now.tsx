const updates = [
  {
    label: "正在做",
    text: "YC IP · AI Agent / Obsidian 知识库 · 原子习惯",
  },
  {
    label: "正在学",
    text: "AI automation · Content Creation · Visual Storytelling",
  },
  {
    label: "最近想说",
    text: "认真生活 期待未来。 Love life.  Work Hard. Be kind.",
  },
];

export default function Now() {
  return (
    <section className="now" id="now" aria-labelledby="now-title">
      <div className="ambient" data-ambient="firefly" aria-hidden="true"></div>
      <div className="container">
        <div className="now-note reveal">
          <div className="now-intro">
            <span className="sec-num">02</span>
            <p className="now-kicker deco">Now / lately</p>
            <h2 id="now-title" className="sec-title serif">
              最近的 YC
            </h2>
            <p>不是一次性做完的人，而是正在认真发生的人。</p>
          </div>
          <dl className="now-list">
            {updates.map((update) => (
              <div key={update.label}>
                <dt>{update.label}</dt>
                <dd>{update.text}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="now-sign script"
            id="nowVideoTrigger"
            aria-label="播放 YC 影片"
          >
            keep going →
          </button>
        </div>
      </div>
    </section>
  );
}
