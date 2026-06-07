import type { Playlist } from "../model/types";

class PlaylistServiceImpl {
  createNameFromSelection(fallbackIndex: number): string {
    return `Playlist ${fallbackIndex}`;
  }

  normalizeName(name: string): string {
    return name.trim() || "Untitled Playlist";
  }

  removePathFromAll(playlists: Playlist[], path: string): Playlist[] {
    return playlists.map((playlist) => ({
      ...playlist,
      trackPaths: playlist.trackPaths.filter((trackPath) => trackPath !== path),
    }));
  }
}

export const playlistService = new PlaylistServiceImpl();
