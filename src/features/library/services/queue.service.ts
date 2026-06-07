import type { MediaItem, Playlist } from "../model/types";
import { useLibraryStore } from "../store/library.store";

export function resolveTracksByPaths(
  paths: string[],
  library: MediaItem[],
): MediaItem[] {
  const byPath = new Map(library.map((track) => [track.path, track]));
  const seen = new Set<string>();

  return paths.reduce<MediaItem[]>((tracks, path) => {
    if (seen.has(path)) return tracks;
    const track = byPath.get(path);
    if (!track) return tracks;
    seen.add(path);
    tracks.push(track);
    return tracks;
  }, []);
}

export function dedupeQueuePaths(
  existing: MediaItem[],
  incoming: MediaItem[],
): MediaItem[] {
  const paths = new Set(existing.map((item) => item.path));
  return incoming.filter((item) => !paths.has(item.path));
}

class QueueServiceImpl {
  addLibraryTrack(trackId: string): MediaItem | null {
    const { library, queue } = useLibraryStore.getState();
    const track = library.find((item) => item.id === trackId);
    if (!track) return null;

    const unique = dedupeQueuePaths(queue, [track]);
    return unique[0] ?? null;
  }

  ensureQueueTrackFromLibrary(
    trackId: string,
  ): { track: MediaItem; isNew: boolean } | null {
    const { library, queue } = useLibraryStore.getState();
    const libraryTrack = library.find((item) => item.id === trackId);
    if (!libraryTrack) return null;

    const existing = queue.find((item) => item.path === libraryTrack.path);
    if (existing) return { track: existing, isNew: false };

    return { track: libraryTrack, isNew: true };
  }

  buildQueueFromPlaylist(playlist: Playlist, library: MediaItem[]): MediaItem[] {
    return resolveTracksByPaths(playlist.trackPaths, library);
  }
}

export const queueService = new QueueServiceImpl();
