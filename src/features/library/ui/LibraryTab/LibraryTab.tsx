import { EmptyState } from "../../../../shared";
import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import { useMediaImport } from "../../hooks/use-media-import";
import { filterMediaByQuery } from "../../services/media-filter.service";
import { groupMediaByFolder } from "../../services/media-folder.service";
import { useLibraryStore } from "../../store/library.store";
import { LibraryToolbar } from "../LibraryToolbar/LibraryToolbar";
import { MediaCollection } from "../MediaCollection/MediaCollection";
import styles from "./LibraryTab.module.css";

export function LibraryTab() {
  const library = useLibraryStore((s) => s.library);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const selectedMediaId = useLibraryStore((s) => s.selectedMediaId);
  const playLibraryTrack = useLibraryStore((s) => s.playLibraryTrack);
  const playLibraryCollection = useLibraryStore((s) => s.playLibraryCollection);
  const addLibraryTrackToQueue = useLibraryStore((s) => s.addLibraryTrackToQueue);
  const addMediaToQueue = useLibraryStore((s) => s.addMediaToQueue);
  const selectMedia = useLibraryStore((s) => s.selectMedia);
  const nowPlayingId = usePlaybackStore((s) => s.nowPlayingId);
  const currentPath = usePlaybackStore((s) => s.currentPath);
  const { importMedia, isImporting } = useMediaImport("library");

  const filteredTracks = filterMediaByQuery(library, searchQuery);
  const folderGroups = groupMediaByFolder(filteredTracks);
  const hasLibrary = library.length > 0;
  const hasVisibleTracks = filteredTracks.length > 0;

  const isNowPlaying = (item: (typeof filteredTracks)[number]) =>
    item.id === nowPlayingId ||
    (currentPath !== null && item.path === currentPath);

  const handlePlayCollection = (tracks: typeof filteredTracks) => {
    void playLibraryCollection(tracks);
  };

  const addButton = (
    <AddMediaButton
      onAdd={() => void importMedia()}
      loading={isImporting}
      disabled={isImporting}
    />
  );

  return (
    <div className={styles.libraryTab}>
      {hasVisibleTracks ? (
        <>
          <LibraryToolbar
            trackCount={filteredTracks.length}
            folderCount={folderGroups.length}
            onImport={() => void importMedia()}
            isImporting={isImporting}
          />
          <div className={styles.collections}>
            {folderGroups.map((group) => (
              <MediaCollection
                key={group.folderPath}
                folderName={group.folderName}
                tracks={group.tracks}
                selectedId={selectedMediaId}
                isNowPlaying={isNowPlaying}
                onSelectTrack={(item) => selectMedia(item.id)}
                onPlayTrack={(item) => void playLibraryTrack(item.id)}
                onPlayCollection={handlePlayCollection}
                onAddTrackToQueue={(item) => void addLibraryTrackToQueue(item.id)}
                onAddCollectionToQueue={(tracks) => void addMediaToQueue(tracks)}
              />
            ))}
          </div>
        </>
      ) : hasLibrary ? (
        <EmptyState
          title="No matching tracks"
          description="Try a different search term or clear the search bar."
        />
      ) : (
        <EmptyState
          title="Your library is empty"
          description="Import audio files, then use + to add tracks to the queue or double-click to play."
          action={addButton}
        />
      )}
    </div>
  );
}
