import { ChevronDown, ChevronUp, Trash2, XCircle } from "lucide-react";
import { filterMediaByQuery } from "../../services/media-filter.service";
import { useLibraryStore } from "../../store/library.store";
import { MediaTable } from "../MediaTable/MediaTable";
import styles from "../LibraryTab/LibraryTab.module.css";
import tableStyles from "../MediaTable/MediaTable.module.css";

export function QueueTab() {
  const queue = useLibraryStore((s) => s.queue);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const selectedMediaId = useLibraryStore((s) => s.selectedMediaId);
  const removeFromQueue = useLibraryStore((s) => s.removeFromQueue);
  const moveQueueItem = useLibraryStore((s) => s.moveQueueItem);
  const clearQueue = useLibraryStore((s) => s.clearQueue);

  const filtered = filterMediaByQuery(queue, searchQuery);
  const hasMedia = filtered.length > 0;
  const canRemoveSelected =
    Boolean(selectedMediaId) && queue.some((item) => item.id === selectedMediaId);

  return (
    <div className={styles.mediaTab}>
      <div className={styles.sectionToolbar}>
        <span className={styles.sectionTitle}>Queue</span>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${styles.toolbarBtnDanger}`}
            disabled={!canRemoveSelected}
            onClick={() => {
              if (selectedMediaId) void removeFromQueue(selectedMediaId);
            }}
          >
            <Trash2 size={14} />
            Remove
          </button>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${styles.toolbarBtnDanger}`}
            disabled={queue.length === 0}
            onClick={() => void clearQueue()}
          >
            <XCircle size={14} />
            Clear
          </button>
        </div>
      </div>

      {hasMedia ? (
        <MediaTable
          items={filtered}
          renderRowActions={(item) => (
            <>
              <button
                type="button"
                className={tableStyles.actionBtn}
                title="Move up"
                onClick={() => void moveQueueItem(item.id, "up")}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className={tableStyles.actionBtn}
                title="Move down"
                onClick={() => void moveQueueItem(item.id, "down")}
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className={`${tableStyles.actionBtn} ${tableStyles.actionBtnDanger}`}
                title="Remove from queue"
                onClick={() => void removeFromQueue(item.id)}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        />
      ) : (
        <div className={styles.empty}>
          <p>Your queue is empty.</p>
          <span>Add tracks from the library or load a playlist.</span>
        </div>
      )}
    </div>
  );
}
