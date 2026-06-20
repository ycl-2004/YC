// YC personal site — interactions ported from the original script.js.
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
  function openPortraitLightbox(portrait: HTMLElement) {
    if (!pl || !plImg) return
    const img = portrait.querySelector<HTMLImageElement>('.pillar-img')
    if (!img) return
    const card = portrait.closest('.pillar')
    const en = card?.querySelector('.en')?.textContent || ''
    const title = card?.querySelector('h3')?.textContent || ''
    plImg.src = img.currentSrc || img.getAttribute('src') || ''
    plImg.alt = img.alt || title || 'YC 角色动画'
    if (plCap) plCap.textContent = [en, title].filter(Boolean).join(' · ')
    portraitOpener = portrait
    pl.classList.add('open')
    document.body.style.overflow = 'hidden'
    pl.querySelector<HTMLButtonElement>('.portrait-lightbox-close')?.focus()
  }
  function closePortraitLightbox() {
    if (!pl) return
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
  const roleWords = ['creator', 'engineer', 'dreamer', 'music maker', 'life-long learner', 'romantic']
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
  const sections = ['about', 'work', 'scenes', 'values'].map((id) => document.getElementById(id))
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
      let active = false
      document.addEventListener('mousemove', (e) => {
        dot.style.left = e.clientX + 'px'
        dot.style.top = e.clientY + 'px'
        if (!active) {
          active = true
          dot.style.opacity = '1'
        }
      })
      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0'
      })
      document.querySelectorAll('a,button,.tag,.pillar,.scene-card,.ward-rail img').forEach((el) => {
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
  }

  /* ---- platform links: gentle hint if still placeholder ---- */
  document.querySelectorAll<HTMLAnchorElement>('.platforms a').forEach((a) => {
    a.addEventListener('click', (ev) => {
      if (a.getAttribute('href') === '#') {
        ev.preventDefault()
        const s = document.getElementById('shareStatus')
        if (s)
          s.textContent =
            a.getAttribute('data-edit') + ' 链接还没填，可在组件里把 href="#" 换成你的主页地址'
      }
    })
  })

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
  document.querySelectorAll<HTMLElement>('.cta-avatar,.ward-rail img,.values-float').forEach((img) => {
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
