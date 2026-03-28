import testimonials from '../data/testimonials'

function References() {
  return (
    <section className="section" id="references">
      <div className="ref-layout">
        <p className="section-label">Kind words</p>
        <div className="ref-list">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="ref-row">
              <p className="ref-quote">"{t.quote}"</p>
              <footer className="ref-meta">
                <span className="ref-name">{t.name}</span>
                <span className="ref-sep">·</span>
                <span className="ref-role">{t.title}, {t.company}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

export default References
