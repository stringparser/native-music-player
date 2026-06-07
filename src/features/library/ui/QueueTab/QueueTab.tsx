import { ChevronDown, ChevronUp, Trash2, XCircle } from "lucide-react";
import { EmptyState, IconButton } from "../../../../shared";
import { filterMediaByQuery } from "../../services/media-filter.service";
import { useLibraryStore } from "../../store/library.store";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import { MediaTable } from "../MediaTable/MediaTable";
import styles from "../LibraryTab/LibraryTab.module.css";

export function QueueTab() {
  const queue = useLibraryStore((s) => s.queue);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const removeFromQueue = useLibraryStore((s) => s.removeFromQueue);
  const moveQueueItem = useLibraryStore((s) => s.moveQueueItem);
  const clearQueue = useLibraryStore((s) => s.clearQueue);
  const playItem = usePlaybackStore((s) => s.playItem);

  const filtered = filterMediaByQuery(queue, searchQuery);
  const hasMedia = filtered.length > 0;

  return (
    <div className={styles.mediaTab}>
      {hasMedia ? (
        <MediaTable
          items={filtered}
          onPlay={(item) => void playItem(item)}
          renderActionsHeader={() => (
            <IconButton
              title="Clear queue"
              variant="danger"
              disabled={queue.length === 0}
              onClick={() => void clearQueue()}
            >
              <XCircle size={14} />
            </IconButton>
          )}
          renderRowActions={(item) => (
            <>
              <IconButton
                title="Move up"
                onClick={() => void moveQueueItem(item.id, "up")}
              >
                <ChevronUp size={14} />
              </IconButton>
              <IconButton
                title="Move down"
                onClick={() => void moveQueueItem(item.id, "down")}
              >
                <ChevronDown size={14} />
              </IconButton>
              <IconButton
                title="Remove from queue"
                variant="danger"
                onClick={() => void removeFromQueue(item.id)}
              >
                <Trash2 size={14} />
              </IconButton>
            </>
          )}
        />
      ) : (
        <EmptyState
          title="Your queue is empty"
          description="Add tracks from the library, or load a playlist to build what plays next."
        />
      )}
    </div>
  );
}
