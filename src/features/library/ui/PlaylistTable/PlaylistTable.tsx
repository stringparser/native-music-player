import { Play, Trash2 } from "lucide-react";
import {
  DataTable,
  IconButton,
  type DataTableColumn,
} from "../../../../shared";
import type { MediaItem, Playlist } from "../../model/types";
import { resolveTracksByPaths } from "../../services/queue.service";
import { useLibraryStore } from "../../store/library.store";
import styles from "./PlaylistTable.module.css";

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
    return null;
  }

  const columns: DataTableColumn<Playlist>[] = [
    {
      id: "name",
      header: "Name",
      className: styles.colName,
      cell: (playlist) => playlist.name,
    },
    {
      id: "tracks",
      header: "Tracks",
      className: styles.colTracks,
      cell: (playlist) =>
        resolveTracksByPaths(playlist.trackPaths, library).length,
    },
  ];

  return (
    <DataTable
      items={playlists}
      columns={columns}
      getRowKey={(playlist) => playlist.id}
      selectedId={selectedPlaylistId}
      onSelect={(playlist) => selectPlaylist(playlist.id)}
      onDoubleClick={(playlist) => void loadPlaylistToQueue(playlist.id)}
      renderRowActions={(playlist) => (
        <>
          <IconButton
            title="Delete playlist"
            variant="danger"
            onClick={() => void deletePlaylist(playlist.id)}
          >
            <Trash2 size={14} />
          </IconButton>
          <IconButton
            title="Load into queue"
            onClick={() => void loadPlaylistToQueue(playlist.id)}
          >
            <Play size={14} />
          </IconButton>
        </>
      )}
    />
  );
}
