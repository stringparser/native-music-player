import { ListPlus, Trash2 } from "lucide-react";
import { EmptyState, IconButton } from "../../../../shared";
import { filterMediaByQuery, filterPlaylistsByQuery } from "../../services/media-filter.service";
import { useLibraryStore } from "../../store/library.store";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import { MediaTable } from "../MediaTable/MediaTable";
import { PlaylistTable } from "../PlaylistTable/PlaylistTable";
import styles from "./LibraryTab.module.css";

export function LibraryTab() {
  const library = useLibraryStore((s) => s.library);
  const playlists = useLibraryStore((s) => s.playlists);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const addLibraryTrackToQueue = useLibraryStore((s) => s.addLibraryTrackToQueue);
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary);
  const playItem = usePlaybackStore((s) => s.playItem);

  const filteredTracks = filterMediaByQuery(library, searchQuery);
  const filteredPlaylists = filterPlaylistsByQuery(playlists, searchQuery);
  const hasTracks = filteredTracks.length > 0;

  return (
    <div className={styles.mediaTab}>
      <div className={styles.section}>
        {hasTracks ? (
          <MediaTable
            items={filteredTracks}
            onPlay={(item) => void playItem(item)}
            renderRowActions={(item) => (
              <>
                <IconButton
                  title="Add to queue"
                  onClick={() => void addLibraryTrackToQueue(item.id)}
                >
                  <ListPlus size={14} />
                </IconButton>
                <IconButton
                  title="Remove from library"
                  variant="danger"
                  onClick={() => void removeFromLibrary(item.id)}
                >
                  <Trash2 size={14} />
                </IconButton>
              </>
            )}
          />
        ) : (
          <EmptyState
            title="Your library is empty"
            description="Use Add in the tab bar to import audio files, then double-click a track to play."
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
