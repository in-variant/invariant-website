import { useRef, useState } from 'react'
import './CharterFilm.css'

const FILM_SOURCE = '/media/invariant-teaser.mp4'
const FILM_POSTER = '/media/invariant-teaser-poster.jpg'

export default function CharterFilm() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [playbackMessage, setPlaybackMessage] = useState('')

  const playFilm = () => {
    const video = videoRef.current
    if (!video) return

    setStarted(true)
    setPlaybackMessage('')
    // Assign the source inside the user gesture: no video request is made
    // while the poster is showing, and sound can start on mobile browsers.
    video.src = FILM_SOURCE
    video.controls = true
    video.muted = false
    video.tabIndex = 0
    const playback = video.play()
    video.focus({ preventScroll: true })
    void playback.catch(() => setPlaybackMessage('Use the video controls to start playback.'))
  }

  return <figure className="charter-film">
    <div className="charter-film__frame">
      <video
        ref={videoRef}
        className="charter-film__video"
        poster={FILM_POSTER}
        preload="none"
        playsInline
        controls={started}
        tabIndex={started ? 0 : -1}
        aria-label="Invariant charter film"
        onPlaying={() => setPlaybackMessage('')}
        onError={() => { if (started) setPlaybackMessage('The film couldn’t load. Please try the video controls again.') }}
      >Your browser does not support this video.</video>
      {!started && <button
        type="button"
        className="charter-film__play"
        onClick={playFilm}
        aria-label="Watch the Invariant film, 15 seconds, with sound"
      >
        <span className="charter-film__play-icon" aria-hidden="true">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M1 1 11 7 1 13V1Z" fill="currentColor" /></svg>
        </span>
        <span className="charter-film__play-copy">
          <span className="charter-film__play-label">Watch the film</span>
          <span className="charter-film__play-meta">00:15 · Sound on</span>
        </span>
      </button>}
      <span className="charter-film__corners" aria-hidden="true"><i /><i /><i /><i /></span>
    </div>
    {playbackMessage && <figcaption className="charter-film__message" role="status">{playbackMessage}</figcaption>}
  </figure>
}
