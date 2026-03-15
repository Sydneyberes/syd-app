import './App.css'

function App() {
  return (
    <div className="portfolio">
      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">Sydney Beres</span>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">Available for work</div>
        <h1 className="hero-title">
          Hi, I'm <span className="accent">Sydney.</span>
          <br />I build things for the web.
        </h1>
        <p className="hero-sub">
          Software engineer passionate about crafting clean, performant,
          and delightful digital experiences.
        </p>
        <div className="hero-actions">
          <a
            href="https://github.com/Sydneyberes"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            View my work
          </a>
          <a href="#contact" className="btn btn-outline">
            Get in touch
          </a>
        </div>
      </section>

      {/* Skills strip */}
      <section className="skills-strip" id="about">
        {['React', 'TypeScript', 'Node.js', 'Vite', 'CSS', 'Git'].map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">
        <h2>Let's connect</h2>
        <p>Feel free to reach out — I'm always open to new opportunities.</p>
        <a
          href="https://github.com/Sydneyberes"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          GitHub →
        </a>
      </section>
    </div>
  )
}

export default App
