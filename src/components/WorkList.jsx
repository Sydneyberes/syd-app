import { Link } from 'react-router-dom'
import projects from '../data/projects'

function WorkList() {
  return (
    <section className="section" id="work">
      <p className="section-label">Selected Work</p>
      <ul className="work-list">
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/work/${p.slug}`} className="work-item">
              <span className="work-index">{p.id}</span>

              <div className="work-content">
                <div className="work-title-row">
                  <span className="work-title">{p.title}</span>
                  <span className="work-year">{p.year}</span>
                </div>
                <div className="work-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="work-tag">{tag}</span>
                  ))}
                </div>
                <p className="work-desc">{p.description}</p>
                <span className="work-cta">
                  View case study <span className="work-arrow">↗</span>
                </span>
              </div>

              <div className="work-thumb-wrap">
                <div className={`work-thumb work-thumb--${p.type}`} aria-hidden="true" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WorkList
