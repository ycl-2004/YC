export default function VideoLightbox() {
  // The <video> ships with no `src` and preload="none" so nothing downloads
  // until the user clicks "keep going →". effects.ts sets the source and calls
  // play() inside that click gesture (so audio is allowed), and clears it on
  // close to stop the download and free memory.
  return (
    <div
      className="video-lightbox"
      id="videoLightbox"
      role="dialog"
      aria-modal="true"
      aria-label="YC 影片"
    >
      <div className="video-lightbox-backdrop" data-close></div>
      <div className="video-lightbox-shell">
        <button
          type="button"
          className="video-lightbox-close"
          data-close
          aria-label="关闭"
        >
          ✕
        </button>
        <video
          className="video-lightbox-video"
          id="videoLbPlayer"
          preload="none"
          controls
          playsInline
        ></video>
      </div>
    </div>
  )
}
