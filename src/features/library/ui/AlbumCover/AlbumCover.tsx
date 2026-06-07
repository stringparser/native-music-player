import { forwardRef } from "react";
import { Play } from "lucide-react";
import { folderAccentColor } from "../../services/media-folder.service";
import styles from "./AlbumCover.module.css";

interface AlbumCoverProps {
  folderName: string;
  isExpanded?: boolean;
  onClick: () => void;
  onPlay: () => void;
}

export const AlbumCover = forwardRef<HTMLDivElement, AlbumCoverProps>(
  function AlbumCover(
    { folderName, isExpanded = false, onClick, onPlay },
    ref,
  ) {
    const artworkColor = folderAccentColor(folderName);

    return (
      <div
        ref={ref}
        className={`${styles.coverCard} ${isExpanded ? styles.coverExpanded : ""}`}
      >
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
  },
);
