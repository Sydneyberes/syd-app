import { Link } from 'react-router-dom'

function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-name">Sydney Beres</Link>
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
