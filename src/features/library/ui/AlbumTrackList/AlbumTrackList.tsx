import { Play, Plus } from "lucide-react";
import { ToolbarButton } from "../../../../shared";
import type { MediaItem } from "../../model/types";
import { MediaTrackRow } from "../MediaTrackRow/MediaTrackRow";
import styles from "./AlbumTrackList.module.css";

interface AlbumTrackListProps {
  tracks: MediaItem[];
  selectedId?: string | null;
  isNowPlaying?: (item: MediaItem) => boolean;
  onSelectTrack: (item: MediaItem) => void;
  onPlayTrack: (item: MediaItem) => void;
  onPlayCollection?: (tracks: MediaItem[]) => void;
  onAddTrackToQueue?: (item: MediaItem) => void;
  onAddCollectionToQueue?: (tracks: MediaItem[]) => void;
}

export function AlbumTrackList({
  tracks,
  selectedId,
  isNowPlaying,
  onSelectTrack,
  onPlayTrack,
  onPlayCollection,
  onAddTrackToQueue,
  onAddCollectionToQueue,
}: AlbumTrackListProps) {
  return (
    <div className={styles.trackList}>
      {(onPlayCollection || onAddCollectionToQueue) && (
        <div className={styles.trackListActions}>
          {onPlayCollection && (
            <ToolbarButton
              label="Play"
              icon={<Play size={14} fill="currentColor" />}
              onClick={() => onPlayCollection(tracks)}
            />
          )}
          {onAddCollectionToQueue && (
            <ToolbarButton
              label="Add all to queue"
              icon={<Plus size={14} strokeWidth={2.25} />}
              onClick={() => onAddCollectionToQueue(tracks)}
            />
          )}
        </div>
      )}
      {tracks.map((track, index) => (
        <MediaTrackRow
          key={track.id}
          track={track}
          index={index}
          selected={selectedId === track.id}
          nowPlaying={isNowPlaying?.(track)}
          onSelect={() => onSelectTrack(track)}
          onDoubleClick={() => onPlayTrack(track)}
          onAddToQueue={
            onAddTrackToQueue ? () => onAddTrackToQueue(track) : undefined
          }
        />
      ))}
    </div>
  );
}
