import { useEffect } from 'react'
import Lenis from 'lenis'

const easeOutExpo = (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time))

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
      return header instanceof HTMLElement ? header.offsetHeight + 12 : 108
    }

    function scrollToHash(hash, immediate = false) {
      const target = getAnchorTarget(hash)

      if (!target) {
        return
      }

      lenis.scrollTo(target, {
        offset: -getHeaderOffset(),
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

      scrollToHash(href)
    }

    document.addEventListener('click', handleDocumentClick)

    if (window.location.hash) {
      requestAnimationFrame(() => {
        scrollToHash(window.location.hash, true)
      })
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      lenis.destroy()
    }
  }, [])

  return null
}
