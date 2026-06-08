import { useState } from 'react'
import logo from '../assets/logo.png'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export default function Header({ isAdminRoute = false, onNavigateTo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  const navigate = (target) => {
    handleNavClick()
    if (onNavigateTo) onNavigateTo(target)
  }

  const navPrefix = isAdminRoute ? '/#' : '#'

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand"
          href={isAdminRoute ? '/' : '#top'}
          onClick={(event) => {
            event.preventDefault()
            navigate(isAdminRoute ? '/' : '/#top')
          }}
        >
          <img
            src={logo}
            alt="FOCES Logo"
            className="brand-badge"
            width="48"
            height="48"
          />

          <span className="brand-copy">
            <span className="brand-name">FOCES</span>
            <span className="brand-tagline">
              Forum of Computer Engineering Students
            </span>
          </span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav className={`site-nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Primary">
          <a
            href={`${navPrefix}events`}
            onClick={(event) => {
              event.preventDefault()
              navigate('/#events')
            }}
          >
            Events
          </a>

          <a
            href={`${navPrefix}about`}
            onClick={(event) => {
              event.preventDefault()
              navigate('/#about')
            }}
          >
            About
          </a>

          <a
            href={`${navPrefix}team`}
            onClick={(event) => {
              event.preventDefault()
              navigate('/#team')
            }}
          >
            Team
          </a>

          <a
            href={`${navPrefix}gallery`}
            onClick={(event) => {
              event.preventDefault()
              navigate('/#gallery')
            }}
          >
            Gallery
          </a>

          <a
            className="nav-cta"
            href={`${navPrefix}about`}
            onClick={(event) => {
              event.preventDefault()
              navigate('/#about')
            }}
          >
            Join Forum
          </a>

          <a
            className="nav-admin"
            href="/admin"
            onClick={(event) => {
              event.preventDefault()
              navigate('/admin')
            }}
          >
            Admin
          </a>
        </nav>
      </div>
    </header>
  )
}