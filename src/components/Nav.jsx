import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  const navRef = useRef(null)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, visible: false })

  function handleMouseMove(e) {
    const rect = navRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y, visible: true })
  }

  function handleMouseLeave() {
    setSpotlight(s => ({ ...s, visible: false }))
  }

  return (
    <nav
      ref={navRef}
      className="nav"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <span
        className="nav-spotlight"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <ul className="nav-links">
        <li><a href="/#work">Work</a></li>
        <li><a href="/#about">About</a></li>
        <li><Link to="/blog">Blog</Link></li>
      </ul>
      <a href="mailto:hello@sydneyberes.com" className="nav-cta">Say hello</a>
    </nav>
  )
}

export default Nav
