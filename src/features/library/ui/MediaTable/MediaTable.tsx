import { formatDuration } from "../../../playback/services/time-format.service";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import type { MediaItem } from "../../model/types";
import { useLibraryStore } from "../../store/library.store";
import styles from "./MediaTable.module.css";

interface MediaTableProps {
  items: MediaItem[];
  renderRowActions?: (item: MediaItem) => React.ReactNode;
}

export function MediaTable({ items, renderRowActions }: MediaTableProps) {
  const selectedMediaId = useLibraryStore((s) => s.selectedMediaId);
  const nowPlayingId = usePlaybackStore((s) => s.nowPlayingId);
  const selectMedia = useLibraryStore((s) => s.selectMedia);
  const playItem = usePlaybackStore((s) => s.playItem);

  const rowClassName = (item: MediaItem) => {
    const classes = [];
    if (selectedMediaId === item.id) classes.push(styles.selected);
    if (nowPlayingId === item.id) classes.push(styles.nowPlaying);
    return classes.join(" ");
  };

  const hasActions = Boolean(renderRowActions);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.colTitle}>Title</th>
          <th className={styles.colArtist}>Artist</th>
          <th className={styles.colCategory}>Category</th>
          <th className={styles.colDuration}>Duration</th>
          {hasActions && <th className={styles.colActions} />}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className={rowClassName(item)}
            onClick={() => {
              selectMedia(item.id);
              void playItem(item);
            }}
          >
            <td className={styles.colTitle}>{item.title}</td>
            <td className={styles.colArtist}>{item.artist ?? "—"}</td>
            <td className={styles.colCategory}>{item.category}</td>
            <td className={styles.colDuration}>
              {formatDuration(item.duration)}
            </td>
            {hasActions && (
              <td className={styles.colActions}>
                <div
                  className={styles.rowActions}
                  onClick={(event) => event.stopPropagation()}
                >
                  {renderRowActions?.(item)}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
