import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EmptyState } from "../../../../shared";
import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { usePlaybackStore } from "../../../playback/store/playback.store";
import { useMediaImport } from "../../hooks/use-media-import";
import { filterMediaByQuery } from "../../services/media-filter.service";
import { groupMediaByFolder } from "../../services/media-folder.service";
import { useLibraryStore } from "../../store/library.store";
import { AlbumCover } from "../AlbumCover/AlbumCover";
import { AlbumTrackList } from "../AlbumTrackList/AlbumTrackList";
import { MediaTabToolbar } from "../MediaTabToolbar/MediaTabToolbar";
import { getRowEndIndex, readGridColumnCount } from "./library-grid";
import { scrollAlbumCoverIntoView } from "./library-scroll";
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
  const [expandedFolderPath, setExpandedFolderPath] = useState<string | null>(null);
  const [gridColumns, setGridColumns] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const coverRefs = useRef(new Map<string, HTMLDivElement>());

  const filteredTracks = filterMediaByQuery(library, searchQuery);
  const folderGroups = groupMediaByFolder(filteredTracks);
  const expandedGroup = folderGroups.find((g) => g.folderPath === expandedFolderPath);
  const expandedIndex = expandedFolderPath
    ? folderGroups.findIndex((g) => g.folderPath === expandedFolderPath)
    : -1;
  const trackListInsertIndex =
    expandedIndex >= 0
      ? getRowEndIndex(expandedIndex, gridColumns, folderGroups.length)
      : -1;
  const hasLibrary = library.length > 0;
  const hasVisibleTracks = filteredTracks.length > 0;

  const isNowPlaying = (item: (typeof filteredTracks)[number]) =>
    item.id === nowPlayingId ||
    (currentPath !== null && item.path === currentPath);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolderPath((current) => (current === folderPath ? null : folderPath));
  };

  const bindCoverRef = (folderPath: string, element: HTMLDivElement | null) => {
    if (element) {
      coverRefs.current.set(folderPath, element);
    } else {
      coverRefs.current.delete(folderPath);
    }
  };

  useLayoutEffect(() => {
    if (!expandedFolderPath) return;

    const coverEl = coverRefs.current.get(expandedFolderPath);
    const scrollContainer = gridRef.current?.closest(
      "[data-scroll-container]",
    ) as HTMLElement | null;
    const stickyHeader = scrollContainer?.querySelector(
      "[data-media-tab-toolbar]",
    ) as HTMLElement | null;

    if (!coverEl || !scrollContainer) return;

    scrollAlbumCoverIntoView(coverEl, scrollContainer, stickyHeader);
  }, [expandedFolderPath, trackListInsertIndex]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateColumns = () => {
      setGridColumns(readGridColumnCount(grid));
    };

    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [folderGroups.length]);

  useEffect(() => {
    if (expandedFolderPath && !expandedGroup) {
      setExpandedFolderPath(null);
    }
  }, [expandedFolderPath, expandedGroup]);

  const addButton = (
    <AddMediaButton
      onAdd={() => void importMedia()}
      loading={isImporting}
      disabled={isImporting}
    />
  );

  const trackList = expandedGroup ? (
    <AlbumTrackList
      tracks={expandedGroup.tracks}
      selectedId={selectedMediaId}
      isNowPlaying={isNowPlaying}
      onSelectTrack={(item) => selectMedia(item.id)}
      onPlayTrack={(item) => void playLibraryTrack(item.id)}
      onPlayCollection={(tracks) => void playLibraryCollection(tracks)}
      onAddTrackToQueue={(item) => void addLibraryTrackToQueue(item.id)}
      onAddCollectionToQueue={(tracks) => void addMediaToQueue(tracks)}
    />
  ) : null;

  return (
    <div className={styles.libraryTab}>
      {hasVisibleTracks ? (
        <>
          <MediaTabToolbar
            primaryLabel={
              filteredTracks.length === 1 ? "1 track" : `${filteredTracks.length} tracks`
            }
            secondaryLabel={
              folderGroups.length === 1 ? "1 folder" : `${folderGroups.length} folders`
            }
            onImport={() => void importMedia()}
            isImporting={isImporting}
          />
          <div ref={gridRef} className={styles.coverGrid}>
            {folderGroups.map((group, index) => (
              <Fragment key={group.folderPath}>
                <AlbumCover
                  ref={(element) => bindCoverRef(group.folderPath, element)}
                  folderName={group.folderName}
                  isExpanded={expandedFolderPath === group.folderPath}
                  onClick={() => toggleFolder(group.folderPath)}
                  onPlay={() => void playLibraryCollection(group.tracks)}
                />
                {trackList && index === trackListInsertIndex && (
                  <div className={styles.trackListRow}>{trackList}</div>
                )}
              </Fragment>
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
