function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Available for new work
        </div>

        <h1 className="hero-name">Sydney Beres</h1>

        <p className="hero-tagline">
          Product designer crafting products<br />people love.
        </p>

        <div className="hero-actions">
          <a href="#work" className="btn btn-dark">View work</a>
          <a href="#about" className="btn btn-ghost">About me</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
