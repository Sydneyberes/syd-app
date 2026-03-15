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
            I help teams improve design,<br />
            strategy, and user empathy.
          </h2>
          <p>
            I create elegant digital products driven by user research. My work
            lives at the intersection of craft and clarity — I care as much
            about how something feels to use as how it looks.
          </p>
          <p>
            Based in Los Angeles. Inspired equally by the precision of good
            engineering, the warmth of California light, and the energy of
            Mexico City streets.
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
