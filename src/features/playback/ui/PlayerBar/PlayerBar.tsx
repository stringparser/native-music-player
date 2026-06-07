import { useRef } from "react";
import {
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatPlaybackTime } from "../../services/time-format.service";
import { usePlaybackStore } from "../../store/playback.store";
import styles from "./PlayerBar.module.css";

export function PlayerBar() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const duration = usePlaybackStore((s) => s.duration);
  const volume = usePlaybackStore((s) => s.volume);
  const error = usePlaybackStore((s) => s.error);
  const togglePlay = usePlaybackStore((s) => s.togglePlay);
  const stop = usePlaybackStore((s) => s.stop);
  const next = usePlaybackStore((s) => s.next);
  const previous = usePlaybackStore((s) => s.previous);
  const setVolume = usePlaybackStore((s) => s.setVolume);
  const seek = usePlaybackStore((s) => s.seek);
  const previousVolumeRef = useRef(80);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMuteToggle = () => {
    if (volume === 0) {
      void setVolume(previousVolumeRef.current || 80);
    } else {
      previousVolumeRef.current = volume;
      void setVolume(0);
    }
  };

  return (
    <footer className={styles.playerBar}>
      <div className={styles.controlsLeft}>
        <button
          type="button"
          className={styles.controlBtn}
          title="Previous"
          onClick={() => void previous()}
        >
          <SkipBack size={18} />
        </button>
        <button
          type="button"
          className={`${styles.controlBtn} ${styles.playBtn}`}
          onClick={() => void togglePlay()}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          title="Next"
          onClick={() => void next()}
        >
          <SkipForward size={18} />
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          title="Stop"
          onClick={() => void stop()}
        >
          <Square size={16} />
        </button>
      </div>

      <div className={styles.progressArea}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            className={styles.progressSlider}
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => void seek(Number(e.target.value))}
          />
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>

      <div className={styles.controlsRight}>
        <span className={styles.time}>
          {formatPlaybackTime(currentTime)}
          {duration > 0 && ` / ${formatPlaybackTime(duration)}`}
        </span>

        <div className={styles.volumeGroup}>
          <button
            type="button"
            className={styles.controlBtn}
            title={volume === 0 ? "Unmute" : "Mute"}
            onClick={handleMuteToggle}
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            className={styles.volumeSlider}
            min={0}
            max={100}
            value={volume}
            onChange={(e) => void setVolume(Number(e.target.value))}
          />
        </div>

        <button type="button" className={styles.controlBtn} title="Fullscreen">
          <Maximize2 size={16} />
        </button>
      </div>
    </footer>
  );
}
