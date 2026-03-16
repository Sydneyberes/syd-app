import { Link } from 'react-router-dom'
import projects from '../data/projects'

function WorkEntry({ project: p }) {
  return (
    <article className="work-entry">
      <div className="work-entry-header">
        <p className="work-entry-date">{p.year}</p>
        <h3 className="work-entry-title">
          <Link to={`/work/${p.slug}`}>{p.title}</Link>
        </h3>
        <p className="work-entry-desc">{p.description}</p>
        <div className="work-tags">
          {p.tags.map(tag => (
            <span key={tag} className="work-tag">{tag}</span>
          ))}
        </div>
      </div>

      <Link to={`/work/${p.slug}`} className="work-entry-images">
        <div className="work-entry-img" aria-hidden="true" />
      </Link>
    </article>
  )
}

function WorkList() {
  return (
    <section className="section" id="work">
      <p className="section-label">Selected Work</p>
      <div className="work-entries">
        {projects.map(p => (
          <WorkEntry key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}

export default WorkList
