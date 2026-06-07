import { folderAccentColor } from "../../services/media-folder.service";
import styles from "./AlbumCover.module.css";

interface AlbumCoverProps {
  folderName: string;
  isExpanded?: boolean;
  onClick: () => void;
}

export function AlbumCover({ folderName, isExpanded = false, onClick }: AlbumCoverProps) {
  const artworkColor = folderAccentColor(folderName);

  return (
    <button
      type="button"
      className={`${styles.cover} ${isExpanded ? styles.coverExpanded : ""}`}
      style={{ backgroundColor: artworkColor }}
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? "Hide" : "Show"} tracks for ${folderName}`}
      title={folderName}
      onClick={onClick}
    >
      <span className={styles.coverLabel}>{folderName}</span>
    </button>
  );
}
