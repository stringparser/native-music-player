import { Play } from "lucide-react";
import { folderAccentColor } from "../../services/media-folder.service";
import styles from "./AlbumCover.module.css";

interface AlbumCoverProps {
  folderName: string;
  isExpanded?: boolean;
  onClick: () => void;
  onPlay: () => void;
}

export function AlbumCover({
  folderName,
  isExpanded = false,
  onClick,
  onPlay,
}: AlbumCoverProps) {
  const artworkColor = folderAccentColor(folderName);

  return (
    <div className={`${styles.coverCard} ${isExpanded ? styles.coverExpanded : ""}`}>
      <button
        type="button"
        className={styles.cover}
        style={{ backgroundColor: artworkColor }}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Hide" : "Show"} tracks for ${folderName}`}
        title={folderName}
        onClick={onClick}
      >
        <span className={styles.coverLabel}>{folderName}</span>
      </button>
      <button
        type="button"
        className={styles.playBtn}
        title={`Play ${folderName}`}
        aria-label={`Play ${folderName}`}
        onClick={onPlay}
      >
        <Play size={16} fill="currentColor" />
      </button>
    </div>
  );
}
