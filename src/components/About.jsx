const tools = [
  'Figma', 'Prototyping', 'User Research', 'Design Systems',
  'Framer', 'Usability Testing', 'Information Architecture', 'Notion',
]

function About() {
  return (
    <section className="section" id="about">
      <p className="section-label">About</p>
      <div className="about-grid">
        <div className="about-text">
          <h2>
            Design is how I<br />
            make sense of the world.
          </h2>
          <p>
            I'm a product designer with a passion for creating experiences
            that feel effortless. I believe good design is invisible — it
            gets out of the way and lets people accomplish what they actually
            came to do.
          </p>
          <p>
            My background spans early-stage startups and growth-stage
            products, where I've led design from zero-to-one features to
            large-scale design system initiatives.
          </p>

          <div className="about-tools">
            <p className="about-tools-label">Tools & skills</p>
            <div className="about-tools-grid">
              {tools.map((tool) => (
                <span key={tool} className="about-tool">{tool}</span>
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
