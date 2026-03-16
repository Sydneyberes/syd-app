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
            Designer. Occasional overthinker.<br />
            Usually the one asking why.
          </h2>
          <p>
            I work at the intersection of research and craft — figuring out
            what's broken, then making the fix feel obvious in hindsight.
            Mostly I just care that things work well for the people using them.
          </p>
          <p>
            Based in Los Angeles. Fueled by California light, Mexico City
            street food, and jazz I can't name.
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
