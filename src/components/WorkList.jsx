import projects from '../data/projects'
import WorkEntry from './WorkEntry'

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
