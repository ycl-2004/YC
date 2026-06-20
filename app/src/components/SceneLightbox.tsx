export default function SceneLightbox() {
  return (
    <div className="lightbox" id="sceneLightbox" role="dialog" aria-modal="true" aria-label="场景放大">
      <div className="lightbox-backdrop" data-close></div>
      <figure className="lightbox-fig">
        <button type="button" className="lightbox-close" data-close aria-label="关闭">
          ✕
        </button>
        <button type="button" className="lightbox-nav lightbox-prev" id="lbPrev" aria-label="上一张">
          ‹
        </button>
        <img id="lbImg" src="" alt="" />
        <button type="button" className="lightbox-nav lightbox-next" id="lbNext" aria-label="下一张">
          ›
        </button>
        <figcaption className="lightbox-cap" id="lbCap"></figcaption>
      </figure>
    </div>
  )
}
