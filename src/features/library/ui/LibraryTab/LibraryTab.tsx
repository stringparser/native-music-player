import { Trash2 } from "lucide-react";
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
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary);
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
                title="Remove from library"
                variant="danger"
                onClick={() => void removeFromLibrary(item.id)}
              >
                <Trash2 size={14} />
              </IconButton>
            )}
          />
        ) : (
          <EmptyState
            title="Your library is empty"
            description="Import audio files, then double-click a track to play and add it to the queue."
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
