export interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  path: string;
  category: string;
}

export interface Playlist {
  id: string;
  name: string;
  trackPaths: string[];
}

export interface LibraryData {
  library: MediaItem[];
  playlists: Playlist[];
  queue: MediaItem[];
}
