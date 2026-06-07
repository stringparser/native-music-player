export interface PlaybackPositionEvent {
  positionMs: number;
  durationMs: number;
}

export interface PlaybackStateEvent {
  isPlaying: boolean;
  isPaused: boolean;
  path: string | null;
}

export interface PlaybackStatus {
  positionMs: number;
  durationMs: number;
  isPlaying: boolean;
  isPaused: boolean;
  path: string | null;
  ended: boolean;
}

export interface PlaybackErrorEvent {
  message: string;
  path: string | null;
}

export type PlaybackEventUnlisten = () => void;
