import { Play, Plus } from "lucide-react";
import { ToolbarButton } from "../../../../shared";
import type { MediaItem } from "../../model/types";
import {
  collectionArtist,
  folderAccentColor,
} from "../../services/media-folder.service";
import { MediaTrackRow } from "../MediaTrackRow/MediaTrackRow";
import styles from "./MediaCollection.module.css";

interface MediaCollectionProps {
  folderName: string;
  tracks: MediaItem[];
  selectedId?: string | null;
  isNowPlaying?: (item: MediaItem) => boolean;
  onSelectTrack: (item: MediaItem) => void;
  onPlayTrack: (item: MediaItem) => void;
  onPlayCollection: (tracks: MediaItem[]) => void;
  onAddTrackToQueue?: (item: MediaItem) => void;
  onAddCollectionToQueue?: (tracks: MediaItem[]) => void;
}

export function MediaCollection({
  folderName,
  tracks,
  selectedId,
  isNowPlaying,
  onSelectTrack,
  onPlayTrack,
  onPlayCollection,
  onAddTrackToQueue,
  onAddCollectionToQueue,
}: MediaCollectionProps) {
  const artworkColor = folderAccentColor(folderName);
  const artist = collectionArtist(tracks);
  const trackLabel = tracks.length === 1 ? "1 track" : `${tracks.length} tracks`;

  return (
    <section className={styles.collection}>
      <div className={styles.layout}>
        <div
          className={styles.artwork}
          style={{ backgroundColor: artworkColor }}
          aria-hidden="true"
        >
          <span className={styles.artworkLabel}>{folderName}</span>
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <button
              type="button"
              className={styles.playBtn}
              title={`Play ${folderName}`}
              onClick={() => onPlayCollection(tracks)}
            >
              <Play size={22} fill="currentColor" />
            </button>

            <div className={styles.meta}>
              <span className={styles.artist}>{artist}</span>
              <div className={styles.titleRow}>
                <h2 className={styles.title}>{folderName}</h2>
                <span className={styles.subtitle}>Folder · {trackLabel}</span>
              </div>
            </div>

            <div className={styles.headerAside}>
              <span className={styles.tag}>#{folderName.replace(/\s+/g, "").toLowerCase()}</span>
            </div>
          </header>

          <div className={styles.trackList}>
            {onAddCollectionToQueue && (
              <div className={styles.trackListActions}>
                <ToolbarButton
                  label="Add all to queue"
                  icon={<Plus size={14} strokeWidth={2.25} />}
                  onClick={() => onAddCollectionToQueue(tracks)}
                />
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
        </div>
      </div>
    </section>
  );
}
