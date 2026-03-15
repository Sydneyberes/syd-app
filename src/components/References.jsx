import testimonials from '../data/testimonials'

function References() {
  return (
    <section className="section" id="references">
      <p className="section-label">References</p>
      <div className="ref-grid">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="ref-card">
            <p className="ref-quote">"{t.quote}"</p>
            <footer className="ref-author">
              <span className="ref-name">{t.name}</span>
              <span className="ref-sep">·</span>
              <span className="ref-title">{t.title}, {t.company}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default References
