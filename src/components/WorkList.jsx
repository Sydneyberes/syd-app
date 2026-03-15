import { Link } from 'react-router-dom'
import projects from '../data/projects'

function WorkBlock({ project: p }) {
  return (
    <article className="work-block">
      <Link to={`/work/${p.slug}`} className="work-block-images">
        <div className="work-block-hero" aria-hidden="true" />
        <div className="work-block-strip" aria-hidden="true">
          <div className="work-block-thumb" />
          <div className="work-block-thumb" />
          <div className="work-block-thumb" />
        </div>
      </Link>

      <div className="work-block-info">
        <div className="work-block-meta">
          <h3 className="work-block-title">
            <Link to={`/work/${p.slug}`}>{p.title}</Link>
          </h3>
          <span className="work-block-year">{p.year}</span>
        </div>
        <div className="work-tags">
          {p.tags.map(tag => (
            <span key={tag} className="work-tag">{tag}</span>
          ))}
        </div>
        <p className="work-block-desc">{p.description}</p>
        <Link to={`/work/${p.slug}`} className="work-block-cta">
          View case study <span className="work-arrow">↗</span>
        </Link>
      </div>
    </article>
  )
}

function WorkList() {
  return (
    <section className="section" id="work">
      <p className="section-label">Selected Work</p>
      <div className="work-blocks">
        {projects.map(p => (
          <WorkBlock key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}

export default WorkList
