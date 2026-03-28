import { useState, useRef, useEffect } from 'react'

function DraggableFrame({ children, bgImage }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef(null)
  const LIMIT = 32

  function onPointerDown(e) {
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      active: false,
    }
  }

  function onPointerMove(e) {
    if (!drag.current) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY

    if (!drag.current.active && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      drag.current.active = true
      setIsDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    if (drag.current.active) {
      setPos({
        x: Math.max(-LIMIT, Math.min(LIMIT, drag.current.originX + dx)),
        y: Math.max(-LIMIT, Math.min(LIMIT, drag.current.originY + dy)),
      })
    }
  }

  function onPointerUp() {
    if (drag.current?.active) {
      setIsDragging(false)
      setPos({ x: 0, y: 0 })
    }
    drag.current = null
  }

  return (
    <div
      className="preview-outer"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        ...(bgImage && {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }}
    >
      <div style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        willChange: 'transform',
      }}>
        {children}
      </div>
    </div>
  )
}

function EmbedPreview({ preview }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)
  const protoWidth = preview.embedWidth ?? 1440

  useEffect(() => {
    if (!wrapRef.current) return
    const observer = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width
      setScale(w / protoWidth)
    })
    observer.observe(wrapRef.current)
    return () => observer.disconnect()
  }, [protoWidth])

  const aspect = preview.aspect ?? '16 / 7'
  const [aw, ah] = aspect.split('/').map(Number)
  const protoHeight = (protoWidth / aw) * ah

  return (
    <DraggableFrame bgImage={preview.bgImage}>
      <div ref={wrapRef} className="preview-embed-wrap" style={{ '--preview-aspect': aspect }}>
        <iframe
          src={preview.embed}
          className="preview-embed"
          title="Interactive prototype"
          allow="fullscreen"
          loading="lazy"
          style={{
            width: protoWidth,
            height: protoHeight,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </DraggableFrame>
  )
}

function ProjectPreview({ preview }) {
  const frames = preview?.frames ?? []
  const [activeId, setActiveId] = useState(frames[0]?.id ?? null)

  if (preview?.embed) {
    return <EmbedPreview preview={preview} />
  }

  if (!frames.length) {
    return (
      <DraggableFrame bgImage={preview?.bgImage}>
        {preview?.bgImage
          ? <div className="work-entry-img-transparent" style={{ aspectRatio: preview.aspect ?? '16 / 7' }} aria-hidden="true" />
          : <div className="work-entry-img" aria-hidden="true" />
        }
      </DraggableFrame>
    )
  }

  const useDots = frames.length <= 3

  return (
    <DraggableFrame bgImage={preview?.bgImage}>
      <div className="preview-wrap">
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
          {frames.find(f => f.id === activeId)?.caption && (
            <span className="preview-caption">
              {frames.find(f => f.id === activeId).caption}
            </span>
          )}
        </div>
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
    </DraggableFrame>
  )
}

export default ProjectPreview
