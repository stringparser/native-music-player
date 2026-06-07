import { create } from "zustand";
import type { MediaItem } from "../../library/model/types";
import { getSelectedMedia, useLibraryStore } from "../../library/store/library.store";
import { toastService } from "../../../shared/services/toast.service";
import { playbackService } from "../services/playback.service";

interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  nowPlayingId: string | null;
  currentPath: string | null;
  error: string | null;

  togglePlay: () => Promise<void>;
  stop: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  playSelected: () => Promise<void>;
  playItem: (item: MediaItem) => Promise<void>;

  applyPositionUpdate: (currentTime: number, duration: number) => void;
  applyStateUpdate: (
    isPlaying: boolean,
    isPaused: boolean,
    path: string | null,
  ) => void;
  setNowPlaying: (item: MediaItem) => void;
  clearNowPlaying: () => void;
  setVolumeState: (volume: number) => void;
  setError: (message: string | null) => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  nowPlayingId: null,
  currentPath: null,
  error: null,

  togglePlay: async () => {
    const selected = getSelectedMedia();
    await playbackService.togglePlay(selected);
  },

  stop: async () => {
    await playbackService.stop();
  },

  next: async () => {
    await playbackService.next();
  },

  previous: async () => {
    await playbackService.previous();
  },

  seek: async (time) => {
    set({ currentTime: time });
    await playbackService.seek(time);
  },

  setVolume: async (volume) => {
    await playbackService.setVolume(volume);
  },

  playSelected: async () => {
    const selected = getSelectedMedia();
    if (selected) {
      await playbackService.play(selected);
    }
  },

  playItem: async (item) => {
    await playbackService.play(item);
  },

  applyPositionUpdate: (currentTime, duration) => {
    set({ currentTime, duration });
  },

  applyStateUpdate: (isPlaying, isPaused, path) => {
    set({ isPlaying, isPaused, currentPath: path });
    if (!path) {
      set({ nowPlayingId: null, currentTime: 0, duration: 0 });
      return;
    }

    const { queue, library } = useLibraryStore.getState();
    const item =
      queue.find((entry) => entry.path === path) ??
      library.find((entry) => entry.path === path);

    if (item) {
      set({ nowPlayingId: item.id });
    }
  },

  setNowPlaying: (item) => {
    set({
      nowPlayingId: item.id,
      currentPath: item.path,
      currentTime: 0,
      isPlaying: true,
      isPaused: false,
      error: null,
    });
  },

  clearNowPlaying: () => {
    set({
      nowPlayingId: null,
      currentPath: null,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      duration: 0,
    });
  },

  setVolumeState: (volume) => {
    set({ volume });
  },

  setError: (message) => {
    set({ error: message, isPlaying: false, isPaused: false });
    if (message) {
      toastService.error(message);
    }
  },
}));
