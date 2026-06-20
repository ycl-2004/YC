import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'

const traits: [string, string][] = [
  ['温暖友善', 'warm'],
  ['很会读人', 'reads people'],
  ['真诚投入', 'sincere'],
  ['工程思维', 'builder mind'],
  ['热爱音乐', 'music'],
  ['浪漫主义者', 'romantic'],
  ['梦想家', 'dreamer'],
  ['一直在成长', 'always becoming'],
]

// Each clip is 16 standalone PNG frames swapped one at a time (no merged WebP),
// so exactly one full frame is ever on screen and frames can never overlap.
// frames are produced by scripts/split_stable_animations.py.
const FRAME_COUNT = 16
// Hover scales the card up first, then playback starts once it has grown
// (matches the .ward-frame grow transition in styles.css).
const ENLARGE_MS = 300
const CLIP_ASSET_VERSION = 'frames-16-clean-v6'

const versionedAsset = (path: string) => `${asset(path)}?v=${CLIP_ASSET_VERSION}`

const wardrobeClips = [
  {
    slug: 'tidy-clothes',
    label: '装酷',
    alt: 'YC 整理黑色外套，摆出装酷的姿态',
    frameMs: 110,
  },
  {
    slug: 'listen-music',
    label: '听音乐',
    alt: 'YC 戴着耳机听音乐，随节奏点头',
    frameMs: 110,
  },
  {
    slug: 'adjust-glasses-cool',
    label: '穿搭',
    alt: 'YC 展示穿搭，推了下眼镜',
    frameMs: 110,
  },
  {
    slug: 'love-brain',
    label: '恋爱脑',
    alt: 'YC 的恋爱脑日常：打招呼、自拍、心动',
    frameMs: 110,
  },
  {
    slug: 'late-backpack-run',
    label: '要迟到了',
    alt: 'YC 背着包慌张跑步，像快迟到了一样',
    frameMs: 110,
  },
] as const

type WardrobeClip = (typeof wardrobeClips)[number]

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()
    media.addEventListener('change', updatePreference)

    return () => media.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

function WardrobeAnimation({ clip }: { clip: WardrobeClip }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [frame, setFrame] = useState(1)
  const frameRef = useRef(1)
  const timerRef = useRef<number>()
  const delayRef = useRef<number>()

  const clipBase = 'assets/animate_clips/wardrobe/' + clip.slug
  const frameSrc = (n: number) =>
    versionedAsset(`${clipBase}/frame_${String(n).padStart(2, '0')}.png`)

  // Preload every frame once so swaps are instant (no flash on first play).
  useEffect(() => {
    for (let n = 1; n <= FRAME_COUNT; n += 1) {
      const image = new Image()
      image.src = frameSrc(n)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopTimer = () => {
    if (timerRef.current !== undefined) {
      window.clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }

  const clearEnlargeDelay = () => {
    if (delayRef.current !== undefined) {
      window.clearTimeout(delayRef.current)
      delayRef.current = undefined
    }
  }

  useEffect(() => () => {
    clearEnlargeDelay()
    stopTimer()
  }, [])

  const showFrame = (n: number) => {
    frameRef.current = n
    setFrame(n)
  }

  // Advance forward from the current frame; hold on the last one. Each frame is
  // a full PNG that replaces the previous, so no two poses overlap.
  const startTicking = () => {
    stopTimer()
    if (frameRef.current >= FRAME_COUNT) return
    timerRef.current = window.setInterval(() => {
      showFrame(Math.min(frameRef.current + 1, FRAME_COUNT))
      if (frameRef.current >= FRAME_COUNT) stopTimer()
    }, clip.frameMs)
  }

  // Hover: let the card grow first (CSS :hover scale), then play from frame 1.
  const beginHover = () => {
    if (prefersReducedMotion) return
    clearEnlargeDelay()
    stopTimer()
    showFrame(1)
    delayRef.current = window.setTimeout(startTicking, ENLARGE_MS)
  }

  // Press and hold to freeze on the current frame (study it one frame at a
  // time); release to keep playing from where it paused.
  const pause = () => {
    clearEnlargeDelay()
    stopTimer()
  }

  const resume = () => {
    if (prefersReducedMotion) return
    startTicking()
  }

  const reset = () => {
    clearEnlargeDelay()
    stopTimer()
    showFrame(1)
  }

  return (
    <button
      type="button"
      className="ward-clip"
      aria-label={`${clip.label} 动画预览（按住可暂停逐帧观看）`}
      onBlur={reset}
      onFocus={beginHover}
      onPointerEnter={beginHover}
      onPointerLeave={reset}
      onPointerDown={pause}
      onPointerUp={resume}
      onPointerCancel={resume}
    >
      <span className="ward-frame-stage" aria-hidden="true">
        <img
          className="ward-frame ward-frame-current"
          src={frameSrc(frame)}
          alt=""
          draggable={false}
          loading="lazy"
        />
      </span>
      <span className="ward-caption" aria-hidden="true">{clip.label}</span>
      <span className="sr-only">{clip.alt}</span>
    </button>
  )
}

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
                {wardrobeClips.map((clip) => (
                  <WardrobeAnimation key={clip.slug} clip={clip} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
