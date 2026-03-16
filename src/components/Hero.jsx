function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-name">Sydney Beres</h1>
      <p className="hero-summary">
        Product designer in Los Angeles.
        {' '}I care about making things that feel good to use — not just good to look at.
        {' '}Currently at{' '}
        <a href="https://curri.com" target="_blank" rel="noreferrer">Curri</a>,
        {' '}previously{' '}
        <a href="https://duffl.com" target="_blank" rel="noreferrer">Duffl</a>.
        {' '}Open to new work.
      </p>
      <nav className="hero-links">
        <a href="https://github.com/Sydneyberes" target="_blank" rel="noreferrer">GitHub</a>
        <span className="hero-links-sep">·</span>
        <a href="https://linkedin.com/in/sydneyberes" target="_blank" rel="noreferrer">LinkedIn</a>
        <span className="hero-links-sep">·</span>
        <a href="mailto:sydney.beres@gmail.com">Email</a>
      </nav>
    </section>
  )
}

export default Hero
