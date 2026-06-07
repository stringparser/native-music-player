import { ListPlus, ListMusic, Trash2 } from "lucide-react";
import {
  filterMediaByQuery,
  filterPlaylistsByQuery,
} from "../../services/media-filter.service";
import { getSelectedMedia } from "../../store/library.store";
import { useLibraryStore } from "../../store/library.store";
import { MediaTable } from "../MediaTable/MediaTable";
import { PlaylistTable } from "../PlaylistTable/PlaylistTable";
import styles from "./LibraryTab.module.css";
import tableStyles from "../MediaTable/MediaTable.module.css";

export function LibraryTab() {
  const library = useLibraryStore((s) => s.library);
  const playlists = useLibraryStore((s) => s.playlists);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const selectedMediaId = useLibraryStore((s) => s.selectedMediaId);
  const addLibraryTrackToQueue = useLibraryStore((s) => s.addLibraryTrackToQueue);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary);

  const filteredTracks = filterMediaByQuery(library, searchQuery);
  const filteredPlaylists = filterPlaylistsByQuery(playlists, searchQuery);
  const hasTracks = filteredTracks.length > 0;
  const selectedTrack = getSelectedMedia();

  const handleCreatePlaylist = async () => {
    const defaultName = `Playlist ${playlists.length + 1}`;
    const name = window.prompt("Playlist name", defaultName);
    if (name === null) return;

    const trackPaths = selectedTrack ? [selectedTrack.path] : [];
    await createPlaylist(name, trackPaths);
  };

  return (
    <div className={styles.mediaTab}>
      <div className={styles.sectionToolbar}>
        <span className={styles.sectionTitle}>Library</span>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={styles.toolbarBtn}
            onClick={() => void handleCreatePlaylist()}
          >
            <ListMusic size={14} />
            New playlist
          </button>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${styles.toolbarBtnDanger}`}
            disabled={!selectedMediaId || !library.some((t) => t.id === selectedMediaId)}
            onClick={() => {
              if (selectedMediaId) void removeFromLibrary(selectedMediaId);
            }}
          >
            <Trash2 size={14} />
            Remove track
          </button>
        </div>
      </div>

      <div className={styles.section}>
        {hasTracks ? (
          <MediaTable
            items={filteredTracks}
            renderRowActions={(item) => (
              <button
                type="button"
                className={tableStyles.actionBtn}
                title="Add to queue"
                onClick={() => void addLibraryTrackToQueue(item.id)}
              >
                <ListPlus size={14} />
              </button>
            )}
          />
        ) : (
          <div className={styles.empty}>
            <p>Your library is empty.</p>
            <span>Add audio files to build your collection.</span>
          </div>
        )}
      </div>

      <div className={`${styles.section} ${styles.playlistsSection}`}>
        <div className={styles.sectionHeader}>Playlists</div>
        <PlaylistTable playlists={filteredPlaylists} library={library} />
      </div>
    </div>
  );
}
