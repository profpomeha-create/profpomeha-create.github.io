import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'
import { CustomCursor, ScrollProgress } from '~/components/Chrome'
import { Preloader } from '~/components/Preloader'
import { SceneLayer } from '~/components/SceneLayer'
import { SectionNav } from '~/components/SectionNav'
import { Contact } from '~/components/sections/Contact'
import { Expertise } from '~/components/sections/Expertise'
import { Hero } from '~/components/sections/Hero'
import { Method } from '~/components/sections/Method'
import { Products } from '~/components/sections/Products'
import { Stack } from '~/components/sections/Stack'
import { chapters } from '~/content/site'
import { lenisRef } from '~/lib/lenis'
import { usePrefersReducedMotion } from '~/lib/motion'
import { navBus } from '~/lib/navBus'
import { setChapter } from '~/lib/sceneBus'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Experience() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) setReady(true)
  }, [reduced])

  useGSAP(
    () => {
      if (!ready && !reduced) return

      const lenis = reduced ? null : new Lenis({ autoRaf: false })
      lenisRef.current = lenis

      const onTick = (time: number) => {
        lenis?.raf(time * 1000)
      }

      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(onTick)
        gsap.ticker.lagSmoothing(0)
      }

      const mm = gsap.matchMedia()

      const bindChapters = () => {
        chapters.forEach((ch, i) => {
          ScrollTrigger.create({
            trigger: `#${ch.id}`,
            start: 'top 48%',
            end: 'bottom 48%',
            refreshPriority: -1,
            onToggle: (self) => {
              if (!self.isActive) return
              navBus.setIndex(i)
              setChapter(i, chapters.length)
            },
          })
        })
      }

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hero-title .char, .hero-line, .kpi-tile, .contact-title', {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
        })
        gsap.set('.stack-bus, .stack-drop', { scaleX: 1, scaleY: 1 })
        gsap.set('.contact-terminal .terminal-stroke', { strokeDashoffset: 0 })
        document.querySelectorAll('.stack-led').forEach((led) => {
          led.classList.add('led-on')
        })
        bindChapters()
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-title .char', {
          yPercent: 108,
          stagger: 0.028,
          duration: 0.85,
          ease: 'power3.out',
        })
        gsap.from('.hero-line', {
          y: 20,
          autoAlpha: 0,
          stagger: 0.08,
          delay: 0.3,
          duration: 0.6,
          ease: 'power2.out',
        })
        gsap.from('.kpi-tile', {
          y: 28,
          autoAlpha: 0,
          stagger: 0.1,
          delay: 0.45,
          duration: 0.7,
          ease: 'power3.out',
        })

        const stackTl = gsap.timeline({
          scrollTrigger: { trigger: '#stack', start: 'top 62%', once: true },
        })
        gsap.set('.stack-bus', { scaleX: 0 })
        gsap.set('.stack-drop', { scaleY: 0 })
        stackTl.to('.stack-bus', { scaleX: 1, duration: 0.85, ease: 'power2.inOut' })
        stackTl.to(
          '.stack-drop',
          { scaleY: 1, duration: 0.3, stagger: 0.09, ease: 'power2.out' },
          '-=0.3',
        )
        stackTl.from(
          '.stack-module',
          { y: 26, autoAlpha: 0, duration: 0.5, stagger: 0.09, ease: 'power3.out' },
          '-=0.45',
        )
        gsap.utils.toArray<HTMLElement>('.stack-led').forEach((led, i) => {
          stackTl.call(() => led.classList.add('led-on'), undefined, i === 0 ? '-=0.2' : '+=0.05')
        })

        gsap.from('.expertise-card', {
          y: 28,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#expertise', start: 'top 72%', once: true },
        })

        gsap.from('#method .method-card', {
          y: 28,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#method', start: 'top 72%', once: true },
        })

        ScrollTrigger.create({
          trigger: '#contact',
          start: 'top 72%',
          once: true,
          onEnter: () => {
            gsap.from('.contact-title', {
              y: 42,
              autoAlpha: 0,
              duration: 0.9,
              ease: 'power3.out',
            })
            gsap.to('.contact-terminal .terminal-stroke', {
              strokeDashoffset: 0,
              duration: 1.1,
              stagger: 0.07,
              ease: 'power2.inOut',
            })
          },
        })

        mm.add('(min-width: 900px)', () => {
          const casesPin = document.querySelector<HTMLElement>('.cases-pin')
          const panels = gsap.utils.toArray<HTMLElement>('.case-panel')
          if (casesPin && panels.length) {
            gsap.set(panels, { autoAlpha: 0 })
            gsap.set(panels[0], { autoAlpha: 1 })
            gsap.set(panels[0].querySelector('.case-cover'), { scale: 1 })
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: casesPin,
                start: 'top top',
                end: () => `+=${window.innerHeight * panels.length}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })
            panels.forEach((panel, i) => {
              if (i === 0) return
              const prev = panels[i - 1]
              const copy = panel.querySelectorAll('.case-copy > *')
              tl.to(prev, { autoAlpha: 0, yPercent: -8, duration: 1 }, i - 1)
              tl.fromTo(
                panel,
                { autoAlpha: 0, yPercent: 8 },
                { autoAlpha: 1, yPercent: 0, duration: 1 },
                i - 1,
              )
              tl.fromTo(
                panel.querySelector('.case-cover'),
                { scale: 1.14 },
                { scale: 1, duration: 1, ease: 'none' },
                i - 1,
              )
              tl.from(
                copy,
                { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out' },
                i - 1 + 0.12,
              )
            })
            tl.to({}, { duration: 1 }, panels.length - 1)
          }
        })

        mm.add('(max-width: 899px)', () => {
          gsap.utils.toArray<HTMLElement>('.case-panel').forEach((panel) => {
            gsap.from(panel.querySelector('.case-cover'), {
              scale: 1.16,
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: { trigger: panel, start: 'top 92%', once: true },
            })
            gsap.from(panel.querySelectorAll('.case-copy > *'), {
              y: 26,
              autoAlpha: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: { trigger: panel, start: 'top 72%', once: true },
            })
          })
        })

        bindChapters()
      })

      const onLoad = () => ScrollTrigger.refresh()
      window.addEventListener('load', onLoad)
      const raf = requestAnimationFrame(onLoad)
      void document.fonts?.ready.then(onLoad)

      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('load', onLoad)
        gsap.ticker.remove(onTick)
        lenis?.destroy()
        lenisRef.current = null
        mm.revert()
      }
    },
    { scope: root, dependencies: [ready, reduced] },
  )

  return (
    <div ref={root} className="relative">
      <SceneLayer reduced={reduced} />
      <div className="blueprint" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <CustomCursor />
      <SectionNav />
      {!ready ? <Preloader reduced={reduced} onDone={() => setReady(true)} /> : null}
      <main className="relative z-[2]">
        <Hero />
        <Expertise />
        <Products />
        <Method />
        <Stack />
        <Contact />
      </main>
    </div>
  )
}
