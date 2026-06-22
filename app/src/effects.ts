// YC personal site — legacy DOM interactions mounted from React.
// Runs once after the React tree mounts; all elements it queries are
// rendered by the components with the same ids / classes / data-attrs.
import { sceneData } from './data'
import { asset } from './lib/asset'

export function initEffects(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---- scenes: auto-scroll + drag + click-to-zoom (cards rendered by React) ---- */
  const track = document.getElementById('sceneTrack')
  const row = document.getElementById('sceneRow')
  if (row && track) {
    let paused = false
    let half = 0
    let down = false
    let startX = 0
    let startLeft = 0
    let moved = 0
    const measure = () => {
      half = track.scrollWidth / 2
    }
    setTimeout(measure, 80)
    window.addEventListener('resize', measure)
    ;(function autoscroll() {
      if (!paused && !reduce && half > 0) {
        row.scrollLeft += 0.5
        if (row.scrollLeft >= half) row.scrollLeft -= half
      }
      requestAnimationFrame(autoscroll)
    })()
    row.addEventListener('mouseenter', () => {
      paused = true
    })
    row.addEventListener('mouseleave', () => {
      if (!down) paused = false
    })
    row.addEventListener('pointerdown', (e) => {
      down = true
      moved = 0
      startX = e.clientX
      startLeft = row.scrollLeft
      paused = true
      row.classList.add('grabbing')
    })
    window.addEventListener('pointermove', (e) => {
      if (!down) return
      const dx = e.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      let nl = startLeft - dx
      if (half > 0) {
        if (nl >= half) {
          nl -= half
          startLeft -= half
        } else if (nl < 0) {
          nl += half
          startLeft += half
        }
      }
      row.scrollLeft = nl
    })
    window.addEventListener('pointerup', () => {
      if (!down) return
      down = false
      row.classList.remove('grabbing')
      setTimeout(() => {
        paused = false
      }, 800)
    })
    track.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.scene-card')
      if (!card || moved > 6) return
      openLightbox(Number(card.getAttribute('data-i')))
    })
  }

  /* ---- scene lightbox (click to zoom) ---- */
  const lb = document.getElementById('sceneLightbox')
  const lbImg = document.getElementById('lbImg') as HTMLImageElement | null
  const lbCap = document.getElementById('lbCap')
  let lbI = 0
  function openLightbox(i: number) {
    if (!lb || !lbImg || !lbCap) return
    lbI = (i + sceneData.length) % sceneData.length
    const s = sceneData[lbI]
    lbImg.src = asset('assets/scenes/' + s[0] + '.jpg')
    lbImg.alt = 'YC 场景 · ' + s[2]
    lbCap.innerHTML = s[1] + '<span class="zh">' + s[2] + '</span>'
    lb.classList.add('open')
    document.body.style.overflow = 'hidden'
  }
  function closeLightbox() {
    if (!lb) return
    lb.classList.remove('open')
    document.body.style.overflow = ''
  }
  if (lb) {
    lb.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox)
    })
    const pv = document.getElementById('lbPrev')
    const nx = document.getElementById('lbNext')
    if (pv) pv.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lbI - 1) })
    if (nx) nx.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lbI + 1) })
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') openLightbox(lbI - 1)
      else if (e.key === 'ArrowRight') openLightbox(lbI + 1)
    })
  }

  /* ---- portrait animation lightbox ---- */
  const pl = document.getElementById('portraitLightbox')
  const plImg = document.getElementById('portraitLbImg') as HTMLImageElement | null
  const plCap = document.getElementById('portraitLbCap')
  let portraitOpener: HTMLElement | null = null
  let portraitFrameTimer: number | null = null
  function stopPortraitFrames() {
    if (portraitFrameTimer !== null) {
      window.clearInterval(portraitFrameTimer)
      portraitFrameTimer = null
    }
  }
  function openPortraitLightbox(portrait: HTMLElement) {
    if (!pl || !plImg) return
    stopPortraitFrames()
    const baseImg = portrait.querySelector<HTMLImageElement>('.pillar-img')
    const animImg = portrait.querySelector<HTMLImageElement>('.motion-animation')
    const card = portrait.closest('.pillar')
    const en = card?.querySelector('.en')?.textContent || ''
    const title = card?.querySelector('h3')?.textContent || ''
    const animSrc = animImg?.currentSrc || animImg?.getAttribute('src')
    const frameDir = portrait.getAttribute('data-frame-dir')
    if (animSrc) {
      // animated SVG portrait — the SVG self-animates when shown directly
      plImg.src = animSrc
    } else if (frameDir) {
      // frame-sequence portrait (e.g. reading) — cycle PNG frames in the lightbox
      const count = Number(portrait.getAttribute('data-frame-count')) || 1
      const ver = portrait.getAttribute('data-frame-version') || '1'
      const intervalMs = Number(portrait.getAttribute('data-frame-interval')) || 600
      let fi = 0
      const showFrame = () => {
        plImg.src = `${frameDir}/frame_${String(fi + 1).padStart(2, '0')}.png?v=${ver}`
      }
      showFrame()
      if (!reduce) {
        portraitFrameTimer = window.setInterval(() => {
          fi = (fi + 1) % count
          showFrame()
        }, intervalMs)
      }
    } else if (baseImg) {
      plImg.src = baseImg.currentSrc || baseImg.getAttribute('src') || ''
    }
    plImg.alt = baseImg?.alt || title || 'YC 角色动画'
    if (plCap) plCap.textContent = [en, title].filter(Boolean).join(' · ')
    portraitOpener = portrait
    pl.classList.add('open')
    document.body.style.overflow = 'hidden'
    pl.querySelector<HTMLButtonElement>('.portrait-lightbox-close')?.focus()
  }
  function closePortraitLightbox() {
    if (!pl) return
    stopPortraitFrames()
    pl.classList.remove('open')
    document.body.style.overflow = ''
    portraitOpener?.focus()
    portraitOpener = null
  }
  if (pl) {
    pl.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closePortraitLightbox)
    })
    document.addEventListener('keydown', (e) => {
      if (!pl.classList.contains('open')) return
      if (e.key === 'Escape') closePortraitLightbox()
      else if (e.key === 'Tab') e.preventDefault()
    })
  }
  document.querySelectorAll<HTMLElement>('.motion-portrait').forEach((portrait) => {
    portrait.addEventListener('click', (e) => {
      e.stopPropagation()
      openPortraitLightbox(portrait)
    })
  })

  /* ---- video lightbox (keep going → plays the YC film) ---- */
  const vlb = document.getElementById('videoLightbox')
  const vlPlayer = document.getElementById('videoLbPlayer') as HTMLVideoElement | null
  const vlTrigger = document.getElementById('nowVideoTrigger')
  let vlOpener: HTMLElement | null = null
  function openVideoLightbox() {
    if (!vlb || !vlPlayer) return
    // Assign the source only now, inside the click gesture: nothing downloads
    // until the user actually asks for it. faststart + range means it starts
    // playing after a short buffer, not after the full 46MB. The click is a
    // user gesture, so play() with audio is allowed.
    if (!vlPlayer.getAttribute('src')) {
      vlPlayer.src = asset('assets/final_video_remotion.mp4')
    }
    vlb.classList.add('open')
    document.body.style.overflow = 'hidden'
    vlPlayer.currentTime = 0
    void vlPlayer.play().catch(() => {})
    vlb.querySelector<HTMLButtonElement>('.video-lightbox-close')?.focus()
  }
  function closeVideoLightbox() {
    if (!vlb || !vlPlayer) return
    vlPlayer.pause()
    // Drop the source so a closed lightbox keeps no buffer in memory and never
    // keeps downloading in the background.
    vlPlayer.removeAttribute('src')
    vlPlayer.load()
    vlb.classList.remove('open')
    document.body.style.overflow = ''
    vlOpener?.focus()
    vlOpener = null
  }
  if (vlTrigger) {
    vlTrigger.addEventListener('click', (e) => {
      e.stopPropagation()
      vlOpener = vlTrigger
      openVideoLightbox()
    })
  }
  if (vlb) {
    vlb.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeVideoLightbox)
    })
    document.addEventListener('keydown', (e) => {
      if (!vlb.classList.contains('open')) return
      if (e.key === 'Escape') closeVideoLightbox()
    })
  }

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

  /* ---- count up ---- */
  let counted = false
  function runCount() {
    if (counted) return
    counted = true
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = Number(el.getAttribute('data-count'))
      let cur = 0
      const step = Math.max(1, Math.round(target / 26))
      if (reduce) {
        el.textContent = String(target)
        return
      }
      const t = setInterval(() => {
        cur += step
        if (cur >= target) {
          cur = target
          clearInterval(t)
        }
        el.textContent = String(cur)
      }, 34)
    })
  }
  const heroStats = document.querySelector('.hero-stats')
  if (heroStats) {
    const io2 = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            runCount()
            io2.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    io2.observe(heroStats)
  }

  /* ---- role rotator ---- */
  const roleWords = ['creator', 'engineer', 'dreamer', 'connector', 'music maker', 'life-long learner', 'romantic']
  let ri = 0
  const rot = document.getElementById('rotator')
  if (rot && !reduce) {
    setInterval(() => {
      ri = (ri + 1) % roleWords.length
      rot.style.transition = 'opacity .3s'
      rot.style.opacity = '0'
      setTimeout(() => {
        rot.textContent = roleWords[ri]
        rot.style.opacity = '1'
      }, 300)
    }, 2200)
  }

  /* ---- nav scrolled + scroll progress + active link + parallax ---- */
  const nav = document.getElementById('nav')
  const progress = document.getElementById('progress')
  const sections = ['about', 'now', 'work', 'scenes', 'values'].map((id) => document.getElementById(id))
  const navAnchors: Record<string, HTMLElement> = {}
  document.querySelectorAll('.navlinks a').forEach((a) => {
    navAnchors[(a.getAttribute('href') || '').slice(1)] = a as HTMLElement
  })
  const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
  function onScroll() {
    const y = window.scrollY
    const h = document.documentElement.scrollHeight - window.innerHeight
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'
    if (nav) nav.classList.toggle('scrolled', y > 40)
    let cur: string | null = null
    sections.forEach((s) => {
      if (s && s.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = s.id
    })
    Object.keys(navAnchors).forEach((id) => {
      navAnchors[id].classList.toggle('active', id === cur)
    })
    if (!reduce) {
      parallaxEls.forEach((el) => {
        const sp = Number(el.getAttribute('data-parallax'))
        el.style.transform =
          (el.classList.contains('hero-bgword') ? 'translateY(-50%) ' : '') +
          'translateY(' + y * sp * 0.12 + 'px)'
      })
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ---- custom cursor + magnetic ---- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    const dot = document.querySelector('.cursor-dot') as HTMLElement | null
    if (dot) {
      document.body.classList.add('has-cursor-dot') // hide the native arrow
      let lx = 0
      let ly = 0
      document.addEventListener('mousemove', (e) => {
        dot.style.left = e.clientX + 'px'
        dot.style.top = e.clientY + 'px'
        // light it up on every move — never gate this behind a one-shot flag, or
        // a prior mouseleave would leave the dot dark while the pointer is back.
        dot.style.opacity = '1'
        // sparse, faint stardust trail — only every ~26px of travel
        const dx = e.clientX - lx
        const dy = e.clientY - ly
        if (dx * dx + dy * dy > 26 * 26) {
          lx = e.clientX
          ly = e.clientY
          const t = document.createElement('span')
          t.className = 'cursor-trail'
          t.style.left = e.clientX + 'px'
          t.style.top = e.clientY + 'px'
          document.body.appendChild(t)
          setTimeout(() => t.remove(), 700)
        }
      })
      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0'
      })
      document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1'
      })
      document.querySelectorAll('a,button,.trait,.pillar,.scene-card,.ward-clip').forEach((el) => {
        el.addEventListener('mouseenter', () => dot.classList.add('grow'))
        el.addEventListener('mouseleave', () => dot.classList.remove('grow'))
      })
    }
    // pillar spotlight sheen following cursor
    document.querySelectorAll<HTMLElement>('.pillar').forEach((p) => {
      p.addEventListener('mousemove', (e) => {
        const r = p.getBoundingClientRect()
        p.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
        p.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
      })
    })
    // The about traits use the same cursor-led spotlight language as the work cards,
    // but stay lightweight enough to read as personal notes rather than product UI.
    document.querySelectorAll<HTMLElement>('.trait').forEach((trait) => {
      trait.addEventListener('mousemove', (e) => {
        const r = trait.getBoundingClientRect()
        trait.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
        trait.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
      })
    })
    // magnetic
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - r.left - r.width / 2
        const y = e.clientY - r.top - r.height / 2
        el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = ''
      })
    })
    // YC chibi leans toward the cursor (A2). The offsets feed bob's keyframe
    // vars (--yc-tx/ty/rot) so the idle float and the follow stack cleanly.
    const stage = document.getElementById('figStage')
    const hero = document.querySelector('.hero') as HTMLElement | null
    if (stage && hero) {
      const clamp = (v: number) => Math.max(-1, Math.min(1, v))
      hero.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect()
        const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2))
        const dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2))
        stage.style.setProperty('--yc-tx', (dx * 10).toFixed(1) + 'px')
        stage.style.setProperty('--yc-ty', (dy * 7).toFixed(1) + 'px')
        stage.style.setProperty('--yc-rot', (dx * 5).toFixed(2) + 'deg')
      })
      hero.addEventListener('mouseleave', () => {
        stage.style.setProperty('--yc-tx', '0px')
        stage.style.setProperty('--yc-ty', '0px')
        stage.style.setProperty('--yc-rot', '0deg')
      })
    }
  }

  /* ---- hidden YC easter eggs: click the giant decorative marks to find a
     sticker that has never shown its face; progress persists in localStorage. ---- */
  if (!reduce) {
    const eggs = [
      { sel: '.hero-name, .hero-bgword', img: 'assets/stickers/v-peace.png', note: '找到我啦～' },
      { sel: '.pq-bgword', img: 'assets/stickers/v-guitar.png', note: '创作中…' },
      { sel: '.foot-brand', img: 'assets/stickers/v-teddy.png', note: '晚安 🌙' },
    ]
    const KEY = 'yc-eggs-found'
    let found: Set<string>
    try {
      found = new Set<string>(JSON.parse(localStorage.getItem(KEY) || '[]'))
    } catch {
      found = new Set<string>()
    }
    let live = false // only one reveal on screen at a time
    const dotEl = document.querySelector('.cursor-dot') as HTMLElement | null
    const CONFETTI = ['#e8657a', '#5b8cd1', '#f4b740', '#5E8C68', '#b23a48']

    const burst = () => {
      const box = document.createElement('div')
      box.className = 'egg-confetti'
      box.setAttribute('aria-hidden', 'true')
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('i')
        const ang = (i / 18) * Math.PI * 2
        const dist = 90 + Math.random() * 100
        p.style.setProperty('--tx', (Math.cos(ang) * dist).toFixed(0) + 'px')
        p.style.setProperty('--ty', (Math.sin(ang) * dist).toFixed(0) + 'px')
        p.style.setProperty('--r', (Math.random() * 540).toFixed(0) + 'deg')
        p.style.setProperty('--c', CONFETTI[i % CONFETTI.length])
        p.style.animationDelay = (Math.random() * 0.1).toFixed(2) + 's'
        box.appendChild(p)
      }
      document.body.appendChild(box)
      setTimeout(() => box.remove(), 1600)
    }

    const reveal = (img: string, note: string, isNew: boolean, n: number) => {
      const sub = !isNew
        ? '这个你已经找过啦'
        : n >= eggs.length
          ? `全部找齐 ✦ ${n}/${eggs.length} · 你很懂 YC`
          : `已找到 ${n}/${eggs.length} 个隐藏的 YC`
      const veil = document.createElement('div')
      veil.className = 'egg-veil'
      veil.setAttribute('aria-hidden', 'true')
      const pop = document.createElement('div')
      pop.className = 'egg-pop'
      pop.setAttribute('role', 'status')
      pop.innerHTML =
        `<span class="egg-glow" aria-hidden="true"></span>` +
        `<img class="egg-img" src="${asset(img)}" alt="">` +
        `<span class="egg-cap">🎉 <b>${note}</b><span class="sub">${sub}</span></span>`
      document.body.appendChild(veil)
      document.body.appendChild(pop)
      burst()
      requestAnimationFrame(() => pop.classList.add('show'))
      setTimeout(() => {
        veil.remove()
        pop.remove()
        live = false
      }, 2800)
    }

    eggs.forEach(({ sel, img, note }) => {
      document.querySelectorAll<HTMLElement>(sel).forEach((hot) => {
        hot.style.pointerEvents = 'auto'
        hot.classList.add('egg-hot')
        // the native '?' cursor is hidden, so hint via the custom glow dot instead
        hot.addEventListener('mouseenter', () => dotEl?.classList.add('hint'))
        hot.addEventListener('mouseleave', () => dotEl?.classList.remove('hint'))
        hot.addEventListener('click', () => {
          if (live) return
          live = true
          const isNew = !found.has(sel)
          if (isNew) {
            found.add(sel)
            try {
              localStorage.setItem(KEY, JSON.stringify([...found]))
            } catch {
              /* private mode — discovery just won't persist */
            }
          }
          reveal(img, note, isNew, found.size)
        })
      })
    })
  }

  /* ---- name card modal ---- */
  const modal = document.getElementById('cardModal')
  const opener = document.getElementById('shareProfile')
  const statusEl = document.getElementById('shareStatus')
  const setStatus = (t: string) => {
    if (statusEl) statusEl.textContent = t
  }
  function openModal() {
    if (!modal) return
    modal.classList.add('open')
    document.body.style.overflow = 'hidden'
    setStatus('YC 名片已打开')
  }
  function closeModal() {
    if (!modal) return
    modal.classList.remove('open')
    document.body.style.overflow = ''
  }
  if (opener) opener.addEventListener('click', openModal)
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal()
    })
  }
  const copyBtn = document.getElementById('copyLink')
  if (copyBtn)
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href)
        copyBtn.textContent = '已复制 ✓'
        setStatus('主页链接已复制')
        setTimeout(() => {
          copyBtn.textContent = '复制主页链接'
        }, 1800)
      } catch {
        setStatus('请手动复制地址栏链接')
      }
    })

  const copyWechat = document.getElementById('copyWechat') as HTMLButtonElement | null
  if (copyWechat)
    copyWechat.addEventListener('click', async () => {
      const wechatId = copyWechat.getAttribute('data-wechat-id')
      if (!wechatId) return
      try {
        await navigator.clipboard.writeText(wechatId)
        copyWechat.textContent = '已复制 ✓'
        setStatus('微信号已复制')
        setTimeout(() => {
          copyWechat.textContent = '复制 ' + wechatId
        }, 1800)
      } catch {
        setStatus('请手动复制微信号：' + wechatId)
      }
    })
  const dlBtn = document.getElementById('dlCard')
  const card = document.getElementById('nameCard')
  if (dlBtn && card)
    dlBtn.addEventListener('click', async () => {
      const orig = dlBtn.innerHTML
      const { default: html2canvas } = await import('html2canvas')
      dlBtn.innerHTML = '生成中…'
      html2canvas(card, {
        scale: 2,
        backgroundColor: '#FEFCF6',
        logging: false,
        useCORS: true,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        height: card.scrollHeight,
      })
        .then((canvas) => {
          const a = document.createElement('a')
          a.download = 'YC-namecard.png'
          a.href = canvas.toDataURL('image/png')
          a.click()
          setStatus('名片已下载为 PNG')
          dlBtn.innerHTML = '已下载 ✓'
          setTimeout(() => {
            dlBtn.innerHTML = orig
          }, 1800)
        })
        .catch((err: unknown) => {
          console.error('html2canvas error:', err)
          const msg = err instanceof Error ? err.message : String(err)
          setStatus('导出失败：' + msg + '（可直接截图保存这张名片）')
          dlBtn.innerHTML = orig
        })
    })

  /* ---- back to top ---- */
  const backtop = document.getElementById('backTop')
  if (backtop) {
    backtop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    })
    window.addEventListener(
      'scroll',
      () => {
        backtop.classList.toggle('show', window.scrollY > window.innerHeight * 0.9)
      },
      { passive: true },
    )
  }

  /* ---- pillar 3D tilt ---- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll<HTMLElement>('.pillar').forEach((p) => {
      p.addEventListener('mousemove', (e) => {
        const r = p.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        p.style.transform =
          'translateY(-6px) rotateX(' +
          ((0.5 - py) * 5).toFixed(2) +
          'deg) rotateY(' +
          ((px - 0.5) * 6).toFixed(2) +
          'deg)'
      })
      p.addEventListener('mouseleave', () => {
        p.style.transform = ''
      })
    })
  }

  /* ============ 21st.dev-style effects ============ */

  /* ---- meteors (dark values section) ---- */
  const meteorBox = document.getElementById('meteors')
  if (meteorBox && !reduce) {
    for (let m = 0; m < 14; m++) {
      const mt = document.createElement('span')
      mt.className = 'meteor'
      mt.style.left = Math.random() * 100 + '%'
      mt.style.animationDuration = (2.4 + Math.random() * 3.2).toFixed(2) + 's'
      mt.style.animationDelay = (Math.random() * 6).toFixed(2) + 's'
      meteorBox.appendChild(mt)
    }
  }

  /* ---- warm dust motes (drift over the light cream sections) ---- */
  if (!reduce) {
    const dust = document.createElement('div')
    dust.className = 'dust'
    dust.setAttribute('aria-hidden', 'true')
    for (let d = 0; d < 26; d++) {
      const mote = document.createElement('span')
      mote.className = 'mote'
      const size = (2 + Math.random() * 4).toFixed(1)
      mote.style.width = size + 'px'
      mote.style.height = size + 'px'
      mote.style.left = (Math.random() * 100).toFixed(2) + '%'
      mote.style.top = (Math.random() * 100).toFixed(2) + '%'
      mote.style.animationDuration = (16 + Math.random() * 18).toFixed(1) + 's'
      // negative delay so motes are mid-flight on load, not all starting together
      mote.style.animationDelay = (-Math.random() * 30).toFixed(1) + 's'
      dust.appendChild(mote)
    }
    document.body.appendChild(dust)
  }

  /* ---- per-section ambient fields (visible warm cousins of the meteors) ---- */
  if (!reduce) {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    document.querySelectorAll<HTMLElement>('[data-ambient]').forEach((box) => {
      const type = box.dataset.ambient
      const spawn = (cls: string, n: number, style: (el: HTMLElement) => void) => {
        for (let i = 0; i < n; i++) {
          const el = document.createElement('span')
          el.className = cls
          style(el)
          box.appendChild(el)
        }
      }
      if (type === 'glow') {
        spawn('amb-glow', 6, (el) => {
          const s = rnd(220, 420)
          el.style.width = el.style.height = s + 'px'
          el.style.left = rnd(-12, 84) + '%'
          el.style.top = rnd(-14, 66) + '%'
          el.style.animationDuration = rnd(22, 38).toFixed(1) + 's'
          el.style.animationDelay = (-rnd(0, 20)).toFixed(1) + 's'
        })
      } else if (type === 'sparkle') {
        spawn('amb-sparkle', 24, (el) => {
          const s = rnd(5, 12)
          el.style.width = el.style.height = s + 'px'
          el.style.left = rnd(0, 100) + '%'
          el.style.top = rnd(0, 100) + '%'
          el.style.animationDuration = rnd(3.4, 7).toFixed(1) + 's'
          el.style.animationDelay = (-rnd(0, 7)).toFixed(1) + 's'
        })
      } else if (type === 'bubble') {
        spawn('amb-bubble', 18, (el) => {
          const s = rnd(8, 26)
          el.style.width = el.style.height = s + 'px'
          el.style.left = rnd(0, 100) + '%'
          el.style.animationDuration = rnd(12, 22).toFixed(1) + 's'
          el.style.animationDelay = (-rnd(0, 18)).toFixed(1) + 's'
        })
      } else if (type === 'petal') {
        spawn('amb-petal', 16, (el) => {
          const w = rnd(8, 16)
          el.style.width = w + 'px'
          el.style.height = (w * 0.9).toFixed(1) + 'px'
          el.style.left = rnd(0, 100) + '%'
          el.style.animationDuration = rnd(9, 16).toFixed(1) + 's'
          el.style.animationDelay = (-rnd(0, 14)).toFixed(1) + 's'
        })
      } else if (type === 'comet') {
        // sparse warm shooting stars launched from the upper-left sky zone
        spawn('amb-comet', 6, (el) => {
          el.style.left = rnd(-6, 70) + '%'
          el.style.top = rnd(-8, 26) + '%'
          el.style.animationDuration = rnd(3.4, 6).toFixed(1) + 's'
          el.style.animationDelay = (-rnd(0, 9)).toFixed(1) + 's'
        })
      } else if (type === 'firefly') {
        spawn('amb-firefly', 20, (el) => {
          const s = rnd(4, 9)
          el.style.width = el.style.height = s + 'px'
          el.style.left = rnd(0, 100) + '%'
          el.style.top = rnd(0, 100) + '%'
          el.style.animationDuration = rnd(4, 8).toFixed(1) + 's'
          el.style.animationDelay = (-rnd(0, 8)).toFixed(1) + 's'
        })
      }
    })
  }

  /* ---- text reveal: wrap words, light them up on scroll ---- */
  document.querySelectorAll<HTMLElement>('.text-reveal').forEach((el) => {
    if (reduce) return
    let i = 0
    ;(function wrap(node: Node) {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment()
          ;(n.textContent || '').split(/(\s+)/).forEach((tok) => {
            if (tok.trim() === '') {
              frag.appendChild(document.createTextNode(tok))
              return
            }
            const sp = document.createElement('span')
            sp.className = 'word'
            sp.textContent = tok
            sp.style.transitionDelay = (i * 0.05).toFixed(2) + 's'
            i++
            frag.appendChild(sp)
          })
          node.replaceChild(frag, n)
        } else if (n.nodeType === 1 && (n as HTMLElement).tagName !== 'BR') {
          wrap(n)
        }
      })
    })(el)
    const ro = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('lit')
            ro.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    ro.observe(el)
  })

  /* ---- heart burst on finale button ---- */
  function burstHearts(x: number, y: number) {
    if (reduce) return
    const glyphs = ['♥', '✦', '♡']
    for (let k = 0; k < 14; k++) {
      const h = document.createElement('span')
      h.className = 'heart-burst'
      h.textContent = glyphs[k % glyphs.length]
      const ang = Math.random() * Math.PI * 2
      const dist = 50 + Math.random() * 90
      h.style.left = x + 'px'
      h.style.top = y + 'px'
      h.style.color = ['#B23A48', '#CB5A78', '#3B6EA5'][k % 3]
      h.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px')
      h.style.setProperty('--dy', (Math.sin(ang) * dist - 40).toFixed(0) + 'px')
      h.style.setProperty('--rot', (Math.random() * 120 - 60).toFixed(0) + 'deg')
      document.body.appendChild(h)
      setTimeout(() => h.remove(), 950)
    }
  }
  const finaleBtn = document.getElementById('shareProfile')
  if (finaleBtn) finaleBtn.addEventListener('click', (e) => burstHearts(e.clientX, e.clientY))

  /* ---- click a character → springy hop ---- */
  document.querySelectorAll<HTMLElement>('.cta-avatar,.ward-clip,.values-float').forEach((img) => {
    img.addEventListener('click', () => {
      img.classList.remove('hop')
      void img.offsetWidth // reflow so the class re-applies
      img.classList.add('hop')
    })
    img.addEventListener('animationend', (e) => {
      if (e.animationName === 'hop') img.classList.remove('hop')
    })
  })

  /* ---- mobile nav menu (hamburger) ---- */
  const navToggle = document.getElementById('navToggle')
  const navLinks = document.getElementById('navlinks')
  if (navToggle && navLinks) {
    const setMenu = (open: boolean) => {
      navLinks.classList.toggle('open', open)
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单')
    }
    navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')))
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false)
    })
  }
}
