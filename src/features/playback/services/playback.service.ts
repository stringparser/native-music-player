import type { MediaItem } from "../../library/model/types";
import { useLibraryStore } from "../../library/store/library.store";
import { PlaybackClient } from "../clients/playback.client";
import { usePlaybackStore } from "../store/playback.store";

const POLL_INTERVAL_MS = 250;

class PlaybackServiceImpl {
  private initialized = false;
  private unlisteners: Array<() => void> = [];
  private endedHandled = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    this.unlisteners.push(
      await PlaybackClient.onPosition((payload) => {
        usePlaybackStore.getState().applyPositionUpdate(
          payload.positionMs / 1000,
          payload.durationMs / 1000,
        );
      }),
      await PlaybackClient.onState((payload) => {
        usePlaybackStore.getState().applyStateUpdate(
          payload.isPlaying,
          payload.isPaused,
          payload.path,
        );
      }),
      await PlaybackClient.onError((payload) => {
        usePlaybackStore.getState().setError(payload.message);
      }),
    );

    setInterval(() => {
      void this.pollStatus();
    }, POLL_INTERVAL_MS);

    this.initialized = true;
  }

  private async pollStatus(): Promise<void> {
    try {
      const status = await PlaybackClient.status();
      usePlaybackStore.getState().applyPositionUpdate(
        status.positionMs / 1000,
        status.durationMs / 1000,
      );
      usePlaybackStore.getState().applyStateUpdate(
        status.isPlaying,
        status.isPaused,
        status.path,
      );

      if (status.ended) {
        if (!this.endedHandled) {
          this.endedHandled = true;
          await this.handleTrackEnded();
        }
      } else {
        this.endedHandled = false;
      }
    } catch {
      // Ignore poll errors outside Tauri runtime (e.g. browser dev).
    }
  }

  async play(item: MediaItem): Promise<void> {
    await this.init();
    this.endedHandled = false;
    usePlaybackStore.getState().setNowPlaying(item);
    usePlaybackStore.getState().setError(null);
    await PlaybackClient.play(item.path);
  }

  async togglePlay(fallback?: MediaItem): Promise<void> {
    await this.init();
    const { isPlaying, isPaused, nowPlayingId } = usePlaybackStore.getState();

    if (isPlaying) {
      await PlaybackClient.pause();
      return;
    }

    if (isPaused && nowPlayingId) {
      await PlaybackClient.resume();
      return;
    }

    const target = fallback ?? this.resolveSelectedOrQueueHead();
    if (target) {
      await this.play(target);
    }
  }

  async stop(): Promise<void> {
    await this.init();
    await PlaybackClient.stop();
    usePlaybackStore.getState().clearNowPlaying();
  }

  async seek(seconds: number): Promise<void> {
    await this.init();
    await PlaybackClient.seek(Math.round(seconds * 1000));
  }

  async setVolume(volume: number): Promise<void> {
    await this.init();
    usePlaybackStore.getState().setVolumeState(volume);
    await PlaybackClient.setVolume(volume);
  }

  async next(): Promise<void> {
    const nextItem = this.resolveNextInQueue();
    if (nextItem) {
      await this.play(nextItem);
    }
  }

  async previous(): Promise<void> {
    const { currentTime } = usePlaybackStore.getState();
    if (currentTime > 3) {
      await this.seek(0);
      return;
    }

    const prevItem = this.resolvePreviousInQueue();
    if (prevItem) {
      await this.play(prevItem);
    } else {
      await this.seek(0);
    }
  }

  private async handleTrackEnded(): Promise<void> {
    const nextItem = this.resolveNextInQueue();
    if (nextItem) {
      await this.play(nextItem);
      return;
    }

    usePlaybackStore.getState().clearNowPlaying();
  }

  private resolveSelectedOrQueueHead(): MediaItem | undefined {
    const { selectedMediaId, queue, library } = useLibraryStore.getState();

    if (selectedMediaId) {
      const selected =
        queue.find((item) => item.id === selectedMediaId) ??
        library.find((item) => item.id === selectedMediaId);
      if (selected) return selected;
    }

    return queue[0];
  }

  private resolveNextInQueue(): MediaItem | undefined {
    const { queue } = useLibraryStore.getState();
    const { nowPlayingId } = usePlaybackStore.getState();

    if (queue.length === 0) return undefined;

    const currentIndex = queue.findIndex((item) => item.id === nowPlayingId);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      return queue[currentIndex + 1];
    }

    return undefined;
  }

  private resolvePreviousInQueue(): MediaItem | undefined {
    const { queue } = useLibraryStore.getState();
    const { nowPlayingId } = usePlaybackStore.getState();

    if (queue.length === 0) return undefined;

    const currentIndex = queue.findIndex((item) => item.id === nowPlayingId);
    if (currentIndex > 0) {
      return queue[currentIndex - 1];
    }

    return undefined;
  }
}

export const playbackService = new PlaybackServiceImpl();
