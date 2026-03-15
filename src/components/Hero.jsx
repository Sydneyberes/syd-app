function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Available for new work
      </div>

      <div className="hero-body">
        <h1 className="hero-name">
          Sydney<br />Beres
        </h1>

        <div className="hero-right">
          <p className="hero-role">Product Designer</p>
          <p className="hero-tagline">
            I craft products<br />people love.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-dark">View work ↓</a>
            <a href="#about" className="btn btn-ghost">About me</a>
          </div>
        </div>
      </div>

      <div className="hero-divider" />
    </section>
  )
}

export default Hero
