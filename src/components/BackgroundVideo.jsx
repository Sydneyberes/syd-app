// Drop your video file at public/bg.mp4 to activate.
// Good sources: pexels.com (search "sunlight leaves bokeh" or "dappled light")
// Recommended: 1920x1080, under 8MB, looping clip, no audio needed

function BackgroundVideo() {
  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        className="bg-video"
        autoPlay
        loop
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
