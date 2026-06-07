import { formatDuration } from "../../../playback/services/time-format.service";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import { ToolbarButton } from "../../../../shared";
import { DataTable, type DataTableColumn } from "../../../../shared/ui/DataTable/DataTable";
import type { MediaItem } from "../../model/types";
import { useLibraryStore } from "../../store/library.store";
import tableStyles from "../../../../shared/ui/DataTable/DataTable.module.css";
import styles from "./MediaTable.module.css";

const mediaColumns: DataTableColumn<MediaItem>[] = [
  {
    id: "title",
    header: "Title",
    className: styles.colTitle,
    cell: (item) => <span className={tableStyles.cellPrimary}>{item.title}</span>,
  },
  {
    id: "artist",
    header: "Artist",
    className: styles.colArtist,
    cell: (item) => item.artist ?? "—",
  },
  {
    id: "category",
    header: "Category",
    className: styles.colCategory,
    cell: (item) => item.category,
  },
  {
    id: "duration",
    header: "Duration",
    className: styles.colDuration,
    cell: (item) => formatDuration(item.duration),
  },
];

interface MediaTableProps {
  items: MediaItem[];
  onPlay?: (item: MediaItem) => void;
  renderRowActions?: (item: MediaItem) => React.ReactNode;
  renderActionsHeader?: () => React.ReactNode;
}

function ActionsHeaderPlaceholder() {
  return (
    <span className={tableStyles.actionsHeaderPlaceholder} aria-hidden="true">
      <ToolbarButton label="Clear All" variant="danger" disabled />
    </span>
  );
}

export function MediaTable({
  items,
  onPlay,
  renderRowActions,
  renderActionsHeader,
}: MediaTableProps) {
  const selectedMediaId = useLibraryStore((s) => s.selectedMediaId);
  const nowPlayingId = usePlaybackStore((s) => s.nowPlayingId);
  const currentPath = usePlaybackStore((s) => s.currentPath);
  const selectMedia = useLibraryStore((s) => s.selectMedia);

  return (
    <DataTable
      items={items}
      columns={mediaColumns}
      getRowKey={(item) => item.id}
      selectedId={selectedMediaId}
      isNowPlaying={(item) =>
        item.id === nowPlayingId ||
        (currentPath !== null && item.path === currentPath)
      }
      onSelect={(item) => selectMedia(item.id)}
      onDoubleClick={(item) => onPlay?.(item)}
      renderRowActions={renderRowActions}
      renderActionsHeader={
        renderActionsHeader ??
        (renderRowActions ? () => <ActionsHeaderPlaceholder /> : undefined)
      }
    />
  );
}
