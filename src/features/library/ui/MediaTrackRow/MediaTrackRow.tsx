import { Plus } from "lucide-react";
import { formatDuration } from "../../../playback/services/time-format.service";
import type { MediaItem } from "../../model/types";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import styles from "./MediaTrackRow.module.css";

interface MediaTrackRowProps {
  track: MediaItem;
  index: number;
  artworkColor: string;
  selected?: boolean;
  nowPlaying?: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onAddToQueue?: () => void;
}

export function MediaTrackRow({
  track,
  index,
  artworkColor,
  selected = false,
  nowPlaying = false,
  onSelect,
  onDoubleClick,
  onAddToQueue,
}: MediaTrackRowProps) {
  const rowClass = [
    styles.row,
    selected ? styles.selected : "",
    nowPlaying ? styles.nowPlaying : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rowClass} onClick={onSelect} onDoubleClick={onDoubleClick}>
      <div className={styles.leading}>
        <div
          className={styles.thumb}
          style={{ backgroundColor: artworkColor }}
          aria-hidden="true"
        />
        <span className={styles.index}>{index + 1}</span>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <span className={styles.title}>{track.title}</span>
      </div>
      <div
        className={styles.trailing}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
      >
        {onAddToQueue && (
          <IconButton title="Add to queue" onClick={onAddToQueue}>
            <Plus size={16} strokeWidth={2.25} />
          </IconButton>
        )}
        <span className={styles.duration}>{formatDuration(track.duration)}</span>
      </div>
    </div>
  );
}
