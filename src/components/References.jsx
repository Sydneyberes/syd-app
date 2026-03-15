import testimonials from '../data/testimonials'

function References() {
  return (
    <section className="section" id="references">
      <p className="section-label">References</p>
      <div className="ref-list">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="ref-item">
            <p className="ref-quote">"{t.quote}"</p>
            <footer className="ref-author">
              {t.name}
              <span className="ref-sep">·</span>
              {t.title}, {t.company}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default References
