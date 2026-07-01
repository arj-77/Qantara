import { useEffect, useState } from 'react'
import { navigationLinks } from '../data/siteContent'
import { SmoothScroll } from './SmoothScroll'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInverse, setIsInverse] = useState(false)

  function handleNavClick() {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    function syncHeaderTheme() {
      const darkSection = document.querySelector('[data-header-theme="dark"]')

      if (!darkSection) {
        setIsInverse(false)
        return
      }

      const rect = darkSection.getBoundingClientRect()
      const triggerLine = 110
      const isOverDarkSection = rect.top <= triggerLine && rect.bottom >= triggerLine

      setIsInverse(isOverDarkSection)
    }

    syncHeaderTheme()
    window.addEventListener('scroll', syncHeaderTheme, { passive: true })
    window.addEventListener('resize', syncHeaderTheme)

    return () => {
      window.removeEventListener('scroll', syncHeaderTheme)
      window.removeEventListener('resize', syncHeaderTheme)
    }
  }, [])

  return (
    <header className={`site-header ${isInverse ? 'site-header--inverse' : ''}`}>
      <div className="container">
        <div className="header-shell">
          <div className="header-brand">
            <a className="brand-mark" href="#home" aria-label="Qantara home">
              <img src="/assets/qantara-logo-transparent.png" alt="Qantara" />
            </a>
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            Menu
          </button>

          <nav
            id="primary-navigation"
            className={`primary-nav ${isMenuOpen ? 'is-open' : ''}`}
            aria-label="Primary"
          >
            <div className="primary-nav__links">
              {navigationLinks.map((item) => (
                <a key={item.href} className="nav-link" href={item.href} onClick={handleNavClick}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="header-actions">
              <a
                className="button button--solid nav-cta"
                href="#rfq-form"
                onClick={handleNavClick}
              >
                Submit an RFQ
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">Qantara</p>
          <h2>qantara.uk</h2>
          <p className="footer-copy">
            Global industrial sourcing and procurement support for technical parts, machinery,
            OEM spares, and specialist equipment.
          </p>
        </div>

        <div>
          <p className="footer-title">Quick Links</p>
          <div className="footer-links">
            {navigationLinks.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-title">Contact</p>
          <div className="footer-links">
            <a href="mailto:enquiries@qantara.uk">enquiries@qantara.uk</a>
            <span>United Kingdom</span>
          </div>
        </div>
      </div>

      <div className="container footer-legal">
        <p>
          Qantara Trading is an independent sourcing and procurement support company.
          Manufacturer names, trademarks, part numbers, and references are used for identification
          purposes only. Unless expressly stated, Qantara is not affiliated with or endorsed by
          the original equipment manufacturers.
        </p>
        <p>
          All trademarks, manufacturer names, and part numbers remain the property of their
          respective owners and are used for identification purposes only.
        </p>
      </div>
    </footer>
  )
}

export function Layout({ children }) {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
