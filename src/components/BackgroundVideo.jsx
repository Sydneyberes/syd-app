// Drop your video file at public/bg.mp4 to activate.
// Good sources: pexels.com (search "sunlight leaves bokeh" or "dappled light")
// Recommended: 1920x1080, under 8MB, looping clip, no audio needed

import { useEffect, useRef, useState } from 'react'

const PLAYBACK_RATE = 0.6      // 60% speed — slow, dreamy
const FADE_DURATION = 1800     // ms for the crossfade
const FADE_BEFORE_END = 2.5    // seconds before end to start fading out

function BackgroundVideo() {
  const vid1Ref = useRef(null)
  const vid2Ref = useRef(null)
  const [active, setActive] = useState(1)   // which video is visible
  const fadingRef = useRef(false)

  useEffect(() => {
    const v1 = vid1Ref.current
    const v2 = vid2Ref.current
    if (!v1 || !v2) return

    v1.playbackRate = PLAYBACK_RATE
    v2.playbackRate = PLAYBACK_RATE

    // Preload v2 but keep it invisible
    v2.pause()
    v2.currentTime = 0

    const handleTimeUpdate = () => {
      const current = active === 1 ? v1 : v2
      const next    = active === 1 ? v2 : v1

      if (!current.duration) return
      const remaining = current.duration - current.currentTime

      if (remaining <= FADE_BEFORE_END && !fadingRef.current) {
        fadingRef.current = true

        // Reset and play the next video from the start
        next.currentTime = 0
        next.playbackRate = PLAYBACK_RATE
        next.play().catch(() => {})

        // Swap active after fade completes
        setTimeout(() => {
          setActive(prev => (prev === 1 ? 2 : 1))
          current.pause()
          fadingRef.current = false
        }, FADE_DURATION)
      }
    }

    const activeVid = active === 1 ? v1 : v2
    activeVid.addEventListener('timeupdate', handleTimeUpdate)
    return () => activeVid.removeEventListener('timeupdate', handleTimeUpdate)
  }, [active])

  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        ref={vid1Ref}
        className="bg-video"
        style={{
          opacity: active === 1 ? 1 : 0,
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
        autoPlay
        muted
        playsInline
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <video
        ref={vid2Ref}
        className="bg-video"
        style={{
          opacity: active === 2 ? 1 : 0,
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
        muted
        playsInline
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay" />
    </div>
  )
}

export default BackgroundVideo
