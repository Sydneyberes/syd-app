import testimonials from '../data/testimonials'

function Avatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('')
  return <div className="ref-avatar" aria-hidden="true">{initials}</div>
}

function References() {
  return (
    <section className="section" id="references">
      <p className="section-label">References</p>
      <div className="ref-grid">
        {testimonials.map((t) => (
          <div key={t.id} className="ref-card">
            <p className="ref-quote">{t.quote}</p>
            <div className="ref-author">
              <Avatar name={t.name} />
              <div>
                <p className="ref-name">{t.name}</p>
                <p className="ref-title">{t.title}, {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default References
