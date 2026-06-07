import { Plus } from "lucide-react";
import { EmptyState, IconButton } from "../../../../shared";
import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { useMediaImport } from "../../hooks/use-media-import";
import { filterMediaByQuery, filterPlaylistsByQuery } from "../../services/media-filter.service";
import { useLibraryStore } from "../../store/library.store";
import { MediaTable } from "../MediaTable/MediaTable";
import { MediaTableActionsHeader } from "../MediaTable/MediaTableActionsHeader";
import { PlaylistTable } from "../PlaylistTable/PlaylistTable";
import styles from "./LibraryTab.module.css";

export function LibraryTab() {
  const library = useLibraryStore((s) => s.library);
  const playlists = useLibraryStore((s) => s.playlists);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const playLibraryTrack = useLibraryStore((s) => s.playLibraryTrack);
  const addLibraryTrackToQueue = useLibraryStore((s) => s.addLibraryTrackToQueue);
  const { importMedia, isImporting } = useMediaImport("library");

  const filteredTracks = filterMediaByQuery(library, searchQuery);
  const filteredPlaylists = filterPlaylistsByQuery(playlists, searchQuery);
  const hasTracks = filteredTracks.length > 0;

  const addButton = (
    <AddMediaButton
      onAdd={() => void importMedia()}
      loading={isImporting}
      disabled={isImporting}
    />
  );

  return (
    <div className={styles.mediaTab}>
      <div className={styles.section}>
        {hasTracks ? (
          <MediaTable
            items={filteredTracks}
            onPlay={(item) => void playLibraryTrack(item.id)}
            renderActionsHeader={() => (
              <MediaTableActionsHeader onAdd={() => void importMedia()} isImporting={isImporting} />
            )}
            renderRowActions={(item) => (
              <IconButton
                title="Add to queue"
                onClick={() => void addLibraryTrackToQueue(item.id)}
              >
                <Plus size={16} strokeWidth={2.25} />
              </IconButton>
            )}
          />
        ) : (
          <EmptyState
            title="Your library is empty"
            description="Import audio files, then use + to add tracks to the queue or double-click to play."
            action={addButton}
          />
        )}
      </div>

      {filteredPlaylists.length > 0 && (
        <div className={`${styles.section} ${styles.playlistsSection}`}>
          <PlaylistTable playlists={filteredPlaylists} library={library} />
        </div>
      )}
    </div>
  );
}
