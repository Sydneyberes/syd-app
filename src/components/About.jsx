const inspirations = [
  'Human psychology', 'Jazz music', 'California',
  'Mexico City', 'Generative AI', 'Minimalism', 'First principles',
]

function About() {
  return (
    <section className="section" id="about">
      <p className="section-label">About</p>
      <div className="about-layout">

        {/* Left: photo */}
        <div className="about-left">
          <div className="about-photo">
            <img src="/headshot.jpg" alt="Sydney Beres" className="about-photo-img" />
          </div>
        </div>

        {/* Right: text content */}
        <div className="about-content">
          <h2 className="about-headline">
            I help teams level up design,
            strategy, and user empathy.
          </h2>
          <p className="about-body">
            I'm delighted by creating elegant digital products driven by
            user research — and by the process of getting there. I care about
            the craft as much as the outcome.
          </p>
          <p className="about-body">
            Based in Los Angeles. Inspired by human psychology, California
            light, Mexico City, and anything quietly well-made.
          </p>

          <div className="about-tools">
            <p className="about-tools-label">Inspired by</p>
            <div className="about-tools-grid">
              {inspirations.map(i => (
                <span key={i} className="about-tool about-tool--muted">{i}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default About
