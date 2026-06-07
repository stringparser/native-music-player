import { Play, Trash2 } from "lucide-react";
import type { Playlist } from "../../model/types";
import { resolveTracksByPaths } from "../../services/queue.service";
import type { MediaItem } from "../../model/types";
import { useLibraryStore } from "../../store/library.store";
import styles from "./PlaylistTable.module.css";
import tableStyles from "../MediaTable/MediaTable.module.css";

interface PlaylistTableProps {
  playlists: Playlist[];
  library: MediaItem[];
}

export function PlaylistTable({ playlists, library }: PlaylistTableProps) {
  const selectedPlaylistId = useLibraryStore((s) => s.selectedPlaylistId);
  const selectPlaylist = useLibraryStore((s) => s.selectPlaylist);
  const loadPlaylistToQueue = useLibraryStore((s) => s.loadPlaylistToQueue);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);

  if (playlists.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No playlists yet.</p>
        <span>Create one from the toolbar to save a set of tracks.</span>
      </div>
    );
  }

  return (
    <table className={tableStyles.table}>
      <thead>
        <tr>
          <th className={styles.colName}>Name</th>
          <th className={styles.colTracks}>Tracks</th>
          <th className={tableStyles.colActions} />
        </tr>
      </thead>
      <tbody>
        {playlists.map((playlist) => {
          const tracks = resolveTracksByPaths(playlist.trackPaths, library);
          return (
            <tr
              key={playlist.id}
              className={
                selectedPlaylistId === playlist.id ? tableStyles.selected : ""
              }
              onClick={() => selectPlaylist(playlist.id)}
            >
              <td className={styles.colName}>{playlist.name}</td>
              <td className={styles.colTracks}>{tracks.length}</td>
              <td className={tableStyles.colActions}>
                <div
                  className={tableStyles.rowActions}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className={tableStyles.actionBtn}
                    title="Load into queue"
                    onClick={() => void loadPlaylistToQueue(playlist.id)}
                  >
                    <Play size={14} />
                  </button>
                  <button
                    type="button"
                    className={`${tableStyles.actionBtn} ${tableStyles.actionBtnDanger}`}
                    title="Delete playlist"
                    onClick={() => void deletePlaylist(playlist.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
