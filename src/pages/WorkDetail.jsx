import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects'
import Footer from '../components/Footer'
import ProjectPreview from '../components/ProjectPreview'

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

  const otherProjects = projects.filter(p => p.slug !== slug)

  return (
    <>
      <main className="work-detail">

        {/* Header — constrained */}
        <div className="work-detail-inner">
          <Link to="/#work" className="work-detail-back">← Work</Link>
          <div className="work-detail-header">
            <div className="work-tags" style={{ marginBottom: '16px' }}>
              {project.tags.map(tag => (
                <span key={tag} className="work-tag">{tag}</span>
              ))}
              <span className="work-tag">{project.year}</span>
            </div>
            <h1 className="work-detail-title">{project.title}</h1>
            <p className="work-detail-sub">{project.description}</p>
          </div>
        </div>

        {/* Hero preview — full bleed */}
        <div className="work-detail-hero-preview">
          <ProjectPreview preview={project.preview ?? { frames: [] }} />
        </div>

        {/* Body — constrained */}
        <div className="work-detail-inner">
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

        {/* More work */}
        <div className="work-detail-more">
          <p className="work-detail-more-label">More work</p>
          <div className="work-detail-more-grid">
            {otherProjects.map(p => (
              <Link key={p.slug} to={`/work/${p.slug}`} className="work-detail-more-card">
                <div className="work-detail-more-card-header">
                  <p className="work-detail-more-card-year">{p.year}</p>
                  <h3 className="work-detail-more-card-title">{p.title}</h3>
                  <p className="work-detail-more-card-cta">View case study →</p>
                </div>
                <div className="work-detail-more-card-preview">
                  <ProjectPreview preview={p.preview ?? { frames: [] }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}

export default WorkDetail
