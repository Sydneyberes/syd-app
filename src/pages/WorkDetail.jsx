import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects'
import Footer from '../components/Footer'

function WorkDetail() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <>
        <main className="work-detail">
          <div className="work-detail-inner">
            <Link to="/" className="work-detail-back">← Back</Link>
            <p className="work-detail-404">Project not found.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="work-detail">
        <div className="work-detail-inner">
          <Link to="/#work" className="work-detail-back">← Work</Link>

          {/* Header */}
          <div className="work-detail-header">
            <div className="work-tags" style={{ marginBottom: '20px' }}>
              {project.tags.map(tag => (
                <span key={tag} className="work-tag">{tag}</span>
              ))}
              <span className="work-tag">{project.year}</span>
            </div>
            <h1 className="work-detail-title">{project.title}</h1>
            <p className="work-detail-sub">{project.description}</p>
          </div>

          {/* Hero image placeholder */}
          <div className="work-detail-hero-img" aria-hidden="true" />

          {/* Body placeholder */}
          <div className="work-detail-body">
            <div className="work-detail-section">
              <h2>Overview</h2>
              <p className="work-detail-placeholder">Case study content coming soon.</p>
            </div>
            <div className="work-detail-section">
              <h2>Problem</h2>
              <p className="work-detail-placeholder">Case study content coming soon.</p>
            </div>
            <div className="work-detail-section">
              <h2>Outcome</h2>
              <p className="work-detail-placeholder">Case study content coming soon.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default WorkDetail
