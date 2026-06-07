import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type {
  PlaybackErrorEvent,
  PlaybackEventUnlisten,
  PlaybackPositionEvent,
  PlaybackStateEvent,
  PlaybackStatus,
} from "../model/types";

export const PlaybackClient = {
  play(path: string): Promise<void> {
    return invoke("playback_play", { path });
  },

  pause(): Promise<void> {
    return invoke("playback_pause");
  },

  resume(): Promise<void> {
    return invoke("playback_resume");
  },

  stop(): Promise<void> {
    return invoke("playback_stop");
  },

  seek(positionMs: number): Promise<void> {
    return invoke("playback_seek", { positionMs });
  },

  setVolume(volume: number): Promise<void> {
    return invoke("playback_set_volume", { volume });
  },

  status(): Promise<PlaybackStatus> {
    return invoke("playback_status");
  },

  onPosition(
    handler: (payload: PlaybackPositionEvent) => void,
  ): Promise<PlaybackEventUnlisten> {
    return listen<PlaybackPositionEvent>("playback-position", (event) => {
      handler(event.payload);
    });
  },

  onState(
    handler: (payload: PlaybackStateEvent) => void,
  ): Promise<PlaybackEventUnlisten> {
    return listen<PlaybackStateEvent>("playback-state", (event) => {
      handler(event.payload);
    });
  },

  onEnded(handler: () => void): Promise<PlaybackEventUnlisten> {
    return listen("playback-ended", () => {
      handler();
    });
  },

  onError(
    handler: (payload: PlaybackErrorEvent) => void,
  ): Promise<PlaybackEventUnlisten> {
    return listen<PlaybackErrorEvent>("playback-error", (event) => {
      handler(event.payload);
    });
  },
};
