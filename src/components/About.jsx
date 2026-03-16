const skills = [
  'UX Interviews', 'Journey Mapping', 'Usability Testing',
  'Figma', 'Prototyping', 'Branding',
  'Design Systems', 'Stakeholder Management',
]

const inspirations = [
  'Human psychology', 'Jazz music', 'California',
  'Mexico City', 'Generative AI', 'Minimalism', 'First principles',
]

function About() {
  return (
    <section className="section" id="about">
      <p className="section-label">About</p>
      <div className="about-grid">
        <div className="about-text">
          <h2>
            I help teams level up design,<br />
            strategy, and user empathy.
          </h2>
          <p>
            I'm delighted by creating elegant digital products driven by
            user research — and by the process of getting there. I care about
            the craft as much as the outcome.
          </p>
          <p>
            Based in Los Angeles. Inspired by human psychology, California
            light, Mexico City, and anything quietly well-made.
          </p>

          <div className="about-tools">
            <p className="about-tools-label">Skills</p>
            <div className="about-tools-grid">
              {skills.map(s => (
                <span key={s} className="about-tool">{s}</span>
              ))}
            </div>
          </div>

          <div className="about-tools" style={{ marginTop: '20px' }}>
            <p className="about-tools-label">Inspired by</p>
            <div className="about-tools-grid">
              {inspirations.map(i => (
                <span key={i} className="about-tool about-tool--muted">{i}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-photo">
          <img src="/headshot.jpg" alt="Sydney Beres" className="about-photo-img" />
        </div>
      </div>
    </section>
  )
}

export default About
