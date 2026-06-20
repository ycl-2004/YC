const updates = [
  {
    label: '正在做',
    text: 'RAG 文档问答系统 · YC 个人 IP 网站 · AI Agent / Obsidian 知识库',
  },
  {
    label: '正在学',
    text: 'AI automation · content strategy · visual storytelling',
  },
  {
    label: '最近想说',
    text: '认真生活不是慢，而是知道自己为什么往前走。',
  },
]

export default function Now() {
  return (
    <section className="now" id="now" aria-labelledby="now-title">
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
          <span className="now-sign script" aria-hidden="true">
            keep going →
          </span>
        </div>
      </div>
    </section>
  )
}
