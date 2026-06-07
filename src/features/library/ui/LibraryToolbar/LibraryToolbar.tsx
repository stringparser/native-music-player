import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import styles from "./LibraryToolbar.module.css";

interface LibraryToolbarProps {
  trackCount: number;
  folderCount: number;
  onImport: () => void;
  isImporting: boolean;
}

export function LibraryToolbar({
  trackCount,
  folderCount,
  onImport,
  isImporting,
}: LibraryToolbarProps) {
  const folderLabel = folderCount === 1 ? "1 folder" : `${folderCount} folders`;
  const trackLabel = trackCount === 1 ? "1 track" : `${trackCount} tracks`;

  return (
    <div className={styles.toolbar}>
      <div className={styles.summary}>
        <span className={styles.summaryPrimary}>{trackLabel}</span>
        <span className={styles.summarySecondary}>{folderLabel}</span>
      </div>
      <AddMediaButton onAdd={onImport} loading={isImporting} disabled={isImporting} />
    </div>
  );
}
