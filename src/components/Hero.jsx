function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-name">Sydney Beres</h1>
      <p className="hero-summary">
        Product designer at{' '}
        <a href="https://curri.com" target="_blank" rel="noreferrer">Curri</a>.
        {' '}I make things that are functional, beautiful, and easy to love.
        {' '}Previously at{' '}
        <a href="https://duffl.com" target="_blank" rel="noreferrer">Duffl</a>.
        {' '}Open to new work.
      </p>
      <nav className="hero-links">
        <a href="https://github.com/Sydneyberes" target="_blank" rel="noreferrer">GitHub</a>
        <span className="hero-links-sep">·</span>
        <a href="https://linkedin.com/in/sydneyberes" target="_blank" rel="noreferrer">LinkedIn</a>
        <span className="hero-links-sep">·</span>
        <a href="mailto:hello@sydneyberes.com">Email</a>
      </nav>
    </section>
  )
}

export default Hero
