export default function PortraitLightbox() {
  return (
    <div className="portrait-lightbox" id="portraitLightbox" role="dialog" aria-modal="true" aria-label="角色动画放大">
      <div className="portrait-lightbox-backdrop" data-close></div>
      <figure className="portrait-lightbox-shell">
        <button type="button" className="portrait-lightbox-close" data-close aria-label="关闭">
          ✕
        </button>
        <img className="portrait-lightbox-img" id="portraitLbImg" src="" alt="" />
        <figcaption className="portrait-lightbox-cap" id="portraitLbCap"></figcaption>
      </figure>
    </div>
  )
}
