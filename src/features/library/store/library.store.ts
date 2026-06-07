import { create } from "zustand";
import type { MediaItem, Playlist } from "../model/types";
import { playlistService } from "../services/playlist.service";
import {
  queueService,
} from "../services/queue.service";
import { storageService } from "../services/storage.service";
import { usePlaybackStore } from "../../playback/store/playback.store";
import { playbackService } from "../../playback/services/playback.service";

interface LibraryState {
  library: MediaItem[];
  playlists: Playlist[];
  queue: MediaItem[];
  selectedMediaId: string | null;
  selectedPlaylistId: string | null;
  searchQuery: string;
  hydrated: boolean;

  selectMedia: (id: string | null) => void;
  selectPlaylist: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setLibraryData: (
    library: MediaItem[],
    playlists: Playlist[],
    queue: MediaItem[],
  ) => void;
  setHydrated: (hydrated: boolean) => void;
  appendToLibrary: (items: MediaItem[]) => void;
  appendToQueue: (items: MediaItem[]) => void;
  addMediaToLibrary: (items: MediaItem[]) => Promise<void>;
  addMediaToQueue: (items: MediaItem[]) => Promise<void>;
  addLibraryTrackToQueue: (trackId: string) => Promise<void>;
  loadPlaylistToQueue: (playlistId: string) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  moveQueueItem: (id: string, direction: "up" | "down") => Promise<void>;
  clearQueue: () => Promise<void>;
  createPlaylist: (name: string, trackPaths?: string[]) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  removeFromLibrary: (trackId: string) => Promise<void>;
}

async function persistState(): Promise<void> {
  await storageService.persist();
}

function stopIfPlayingTrack(trackId: string): void {
  const { nowPlayingId } = usePlaybackStore.getState();
  if (nowPlayingId === trackId) {
    void playbackService.stop();
  }
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  library: [],
  playlists: [],
  queue: [],
  selectedMediaId: null,
  selectedPlaylistId: null,
  searchQuery: "",
  hydrated: false,

  selectMedia: (id) => set({ selectedMediaId: id, selectedPlaylistId: null }),

  selectPlaylist: (id) => set({ selectedPlaylistId: id, selectedMediaId: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setLibraryData: (library, playlists, queue) =>
    set({ library, playlists, queue }),

  setHydrated: (hydrated) => set({ hydrated }),

  appendToLibrary: (items) =>
    set((state) => ({ library: [...state.library, ...items] })),

  appendToQueue: (items) =>
    set((state) => ({ queue: [...state.queue, ...items] })),

  addMediaToLibrary: async (items) => {
    const unique = storageService.mergeLibraryItems(items);
    if (unique.length === 0) return;

    get().appendToLibrary(unique);
    await persistState();
  },

  addMediaToQueue: async (items) => {
    const unique = storageService.mergeQueueItems(items);
    if (unique.length === 0) return;

    get().appendToQueue(unique);
    await persistState();
  },

  addLibraryTrackToQueue: async (trackId) => {
    const track = queueService.addLibraryTrack(trackId);
    if (!track) return;

    get().appendToQueue([track]);
    await persistState();
  },

  loadPlaylistToQueue: async (playlistId) => {
    const { playlists, library } = get();
    const playlist = playlists.find((entry) => entry.id === playlistId);
    if (!playlist) return;

    const queue = queueService.buildQueueFromPlaylist(playlist, library);
    set({ queue, selectedMediaId: queue[0]?.id ?? null });
    await persistState();
  },

  removeFromQueue: async (id) => {
    stopIfPlayingTrack(id);
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
      selectedMediaId:
        state.selectedMediaId === id ? null : state.selectedMediaId,
    }));
    await persistState();
  },

  moveQueueItem: async (id, direction) => {
    const queue = [...get().queue];
    const index = queue.findIndex((item) => item.id === id);
    if (index < 0) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= queue.length) return;

    [queue[index], queue[targetIndex]] = [queue[targetIndex], queue[index]];
    set({ queue });
    await persistState();
  },

  clearQueue: async () => {
    const { nowPlayingId } = usePlaybackStore.getState();
    if (nowPlayingId && get().queue.some((item) => item.id === nowPlayingId)) {
      void playbackService.stop();
    }

    set({ queue: [], selectedMediaId: null });
    await persistState();
  },

  createPlaylist: async (name, trackPaths = []) => {
    const normalized = playlistService.normalizeName(name);
    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name: normalized,
      trackPaths: [...new Set(trackPaths)],
    };

    set((state) => ({ playlists: [...state.playlists, playlist] }));
    await persistState();
  },

  deletePlaylist: async (playlistId) => {
    set((state) => ({
      playlists: state.playlists.filter((playlist) => playlist.id !== playlistId),
      selectedPlaylistId:
        state.selectedPlaylistId === playlistId ? null : state.selectedPlaylistId,
    }));
    await persistState();
  },

  removeFromLibrary: async (trackId) => {
    const track = get().library.find((item) => item.id === trackId);
    if (!track) return;

    stopIfPlayingTrack(trackId);

    set((state) => ({
      library: state.library.filter((item) => item.id !== trackId),
      queue: state.queue.filter((item) => item.path !== track.path),
      playlists: playlistService.removePathFromAll(state.playlists, track.path),
      selectedMediaId:
        state.selectedMediaId === trackId ? null : state.selectedMediaId,
    }));
    await persistState();
  },
}));

export function getSelectedMedia(): MediaItem | undefined {
  const { library, queue, selectedMediaId } = useLibraryStore.getState();
  return (
    library.find((item) => item.id === selectedMediaId) ??
    queue.find((item) => item.id === selectedMediaId)
  );
}

export function getSelectedPlaylist(): Playlist | undefined {
  const { playlists, selectedPlaylistId } = useLibraryStore.getState();
  return playlists.find((playlist) => playlist.id === selectedPlaylistId);
}
