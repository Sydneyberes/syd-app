import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import ProjectPreview from './ProjectPreview'

function WorkEntry({ project: p }) {
  const [ref, isVisible] = useInView()

  return (
    <article ref={ref} className={`work-entry${isVisible ? ' is-visible' : ''}`}>
      <div className="work-entry-header">
        <p className="work-entry-date">{p.year}</p>
        <h3 className="work-entry-title">
          <Link to={`/work/${p.slug}`}>{p.title}</Link>
        </h3>
<div className="work-tags">
          {p.tags.map(tag => (
            <span key={tag} className="work-tag">{tag}</span>
          ))}
        </div>
        <Link to={`/work/${p.slug}`} className="work-entry-cta">
          View project →
        </Link>
      </div>

      <ProjectPreview preview={p.preview ?? { frames: [] }} />
    </article>
  )
}

export default WorkEntry
