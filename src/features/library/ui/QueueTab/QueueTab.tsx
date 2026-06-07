import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { EmptyState, IconButton } from "../../../../shared";
import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { useMediaImport } from "../../hooks/use-media-import";
import { filterMediaByQuery } from "../../services/media-filter.service";
import { useLibraryStore } from "../../store/library.store";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import { MediaTable } from "../MediaTable/MediaTable";
import { MediaTableActionsHeader } from "../MediaTable/MediaTableActionsHeader";
import styles from "../LibraryTab/LibraryTab.module.css";

export function QueueTab() {
  const queue = useLibraryStore((s) => s.queue);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const removeFromQueue = useLibraryStore((s) => s.removeFromQueue);
  const moveQueueItem = useLibraryStore((s) => s.moveQueueItem);
  const clearQueue = useLibraryStore((s) => s.clearQueue);
  const playItem = usePlaybackStore((s) => s.playItem);
  const { importMedia, isImporting } = useMediaImport("queue");

  const filtered = filterMediaByQuery(queue, searchQuery);
  const hasMedia = filtered.length > 0;

  const addButton = (
    <AddMediaButton
      onAdd={() => void importMedia()}
      loading={isImporting}
      disabled={isImporting}
    />
  );

  return (
    <div className={styles.mediaTab}>
      {hasMedia ? (
        <MediaTable
          items={filtered}
          onPlay={(item) => void playItem(item)}
          renderActionsHeader={() => (
            <MediaTableActionsHeader
              onAdd={() => void importMedia()}
              isImporting={isImporting}
              onClearAll={() => void clearQueue()}
              clearDisabled={queue.length === 0}
            />
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
          description="Add tracks from the library, or import files to build what plays next."
          action={addButton}
        />
      )}
    </div>
  );
}
