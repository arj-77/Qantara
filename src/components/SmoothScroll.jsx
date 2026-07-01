import { useEffect } from 'react'
import Lenis from 'lenis'

const easeOutExpo = (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time))

const hashOffsets = {
  '#about': -12,
  '#services': -28,
  '#industries': -24,
  '#rfq-form': -22,
}

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotionQuery.matches) {
      return undefined
    }

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.16,
      wheelMultiplier: 1,
      overscroll: true,
    })

    function getAnchorTarget(hash) {
      if (!hash || hash === '#') {
        return null
      }

      const targetId = hash.slice(1)

      return targetId ? document.getElementById(targetId) : null
    }

    function getHeaderOffset() {
      const header = document.querySelector('.site-header')
      return header instanceof HTMLElement ? header.getBoundingClientRect().height + 28 : 128
    }

    function scrollToHash(hash, immediate = false) {
      const target = getAnchorTarget(hash)

      if (!target) {
        return
      }

      const extraOffset = hashOffsets[hash] ?? 0

      lenis.scrollTo(target, {
        offset: -getHeaderOffset() - extraOffset,
        duration: immediate ? 0 : 0.72,
        easing: easeOutExpo,
        immediate,
      })
    }

    function handleDocumentClick(event) {
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null

      if (!(anchor instanceof HTMLAnchorElement)) {
        return
      }

      const href = anchor.getAttribute('href')

      if (!href || href === '#') {
        return
      }

      const target = getAnchorTarget(href)

      if (!target) {
        return
      }

      event.preventDefault()
      if (window.location.hash === href) {
        window.history.replaceState(null, '', href)
      } else {
        window.history.pushState(null, '', href)
      }

      requestAnimationFrame(() => {
        scrollToHash(href)
      })
    }

    document.addEventListener('click', handleDocumentClick)

    function syncInitialHashPosition() {
      if (!window.location.hash) {
        return
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToHash(window.location.hash, true)
        })
      })
    }

    syncInitialHashPosition()
    window.addEventListener('load', syncInitialHashPosition)
    document.fonts?.ready.then(syncInitialHashPosition)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      window.removeEventListener('load', syncInitialHashPosition)
      lenis.destroy()
    }
  }, [])

  return null
}
