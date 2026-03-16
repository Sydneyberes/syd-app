import { useState } from 'react'

function ProjectPreview({ preview }) {
  const frames = preview?.frames ?? []
  const [activeId, setActiveId] = useState(frames[0]?.id ?? null)

  // Placeholder — no frames yet
  if (!frames.length) {
    return (
      <div className="work-entry-img" aria-hidden="true" />
    )
  }

  const useDots = frames.length <= 3

  return (
    <div className="preview-wrap">
      {/* Image stack */}
      <div className="preview-frames" style={{ '--preview-aspect': preview.aspect ?? '16 / 7' }}>
        {frames.map(frame => (
          <img
            key={frame.id}
            src={frame.src}
            alt={frame.alt}
            className={`preview-frame${frame.id === activeId ? ' is-active' : ''}`}
            loading={frame.id === frames[0].id ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}

        {/* Hover caption */}
        {frames.find(f => f.id === activeId)?.caption && (
          <span className="preview-caption">
            {frames.find(f => f.id === activeId).caption}
          </span>
        )}
      </div>

      {/* Tab selector */}
      <div className="preview-tabs" role="tablist">
        {frames.map(frame => (
          useDots
            ? (
              <button
                key={frame.id}
                role="tab"
                aria-selected={frame.id === activeId}
                aria-label={frame.label}
                className={`preview-dot${frame.id === activeId ? ' is-active' : ''}`}
                onClick={() => setActiveId(frame.id)}
              />
            )
            : (
              <button
                key={frame.id}
                role="tab"
                aria-selected={frame.id === activeId}
                className={`preview-tab${frame.id === activeId ? ' is-active' : ''}`}
                onClick={() => setActiveId(frame.id)}
              >
                {frame.label}
              </button>
            )
        ))}
      </div>
    </div>
  )
}

export default ProjectPreview
