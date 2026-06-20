export default function Marquee() {
  const phrases = [
    '认真生活，浪漫创作',
    'Progress > Perfection',
    'Keep creating. Keep shipping.',
    '恋爱脑，但也很上进',
    'One IP, Many Possibilities',
    '用旋律表达爱',
    'Stay curious. Keep growing.',
    '把混乱的想法变成产品',
  ]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="mq-track">
        {/* duplicated once so the scroll loops seamlessly */}
        {[...phrases, ...phrases].map((p, i) => (
          <span key={i}>{p}</span>
        ))}
      </div>
    </div>
  )
}
