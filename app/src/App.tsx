import { useEffect } from 'react'
import { initEffects } from './effects'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Now from './components/Now'
import Work from './components/Work'
import Scenes from './components/Scenes'
import Values from './components/Values'
import PullQuote from './components/PullQuote'
import CTA from './components/CTA'
import NameCardModal from './components/NameCardModal'
import SceneLightbox from './components/SceneLightbox'
import PortraitLightbox from './components/PortraitLightbox'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    // All interactions are imperative DOM code (cursor, parallax, lightbox,
    // counters, meteors, …). Run once after the tree mounts.
    initEffects()
  }, [])

  return (
    <>
      <div className="cursor-dot" aria-hidden="true"></div>
      <div className="progress" id="progress" aria-hidden="true"></div>

      <Nav />
      <span id="top"></span>

      <Hero />
      <Marquee />
      <About />
      <Now />
      <Work />
      <Scenes />
      <Values />
      <PullQuote />
      <CTA />

      <button type="button" className="backtop" id="backTop" aria-label="回到顶部">
        ↑
      </button>

      <NameCardModal />
      <SceneLightbox />
      <PortraitLightbox />

      <p id="shareStatus" role="status" aria-live="polite" className="sr-status"></p>

      <Footer />
    </>
  )
}
