import type { MediaItem, Playlist } from "../model/types";

export function filterMediaByQuery(
  items: MediaItem[],
  query: string,
): MediaItem[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return items;

  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.artist?.toLowerCase().includes(normalized) ||
      item.category.toLowerCase().includes(normalized),
  );
}

export function filterPlaylistsByQuery(
  playlists: Playlist[],
  query: string,
): Playlist[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return playlists;

  return playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(normalized),
  );
}
