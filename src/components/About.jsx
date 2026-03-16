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
            I'm good at helping teams<br />
            be more ambitious together.
          </h2>
          <p>
            Most of my work involves figuring out what people actually need —
            then making it simple enough that no one has to think too hard.
            I do a lot of research, a lot of sketching, and a lot of asking
            "why does it work this way?"
          </p>
          <p>
            Based in Los Angeles. I draw a lot of inspiration from California
            light, Mexico City energy, and anything that's quietly well-made.
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

        <div className="about-photo" aria-hidden="true">
          <span className="about-photo-label">Photo coming soon</span>
        </div>
      </div>
    </section>
  )
}

export default About
