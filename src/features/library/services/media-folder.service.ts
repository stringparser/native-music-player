import type { MediaItem } from "../model/types";

export interface MediaFolderGroup {
  folderPath: string;
  folderName: string;
  tracks: MediaItem[];
}

export function getParentFolderPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash <= 0) return normalized;
  return normalized.slice(0, lastSlash);
}

export function getParentFolderName(filePath: string): string {
  const parentPath = getParentFolderPath(filePath);
  const normalized = parentPath.replace(/\\/g, "/");
  const lastSlash = normalized.lastIndexOf("/");
  const name = lastSlash >= 0 ? normalized.slice(lastSlash + 1) : normalized;
  return name || "Unknown";
}

export function groupMediaByFolder(items: MediaItem[]): MediaFolderGroup[] {
  const groups = new Map<string, MediaFolderGroup>();

  for (const track of items) {
    const folderPath = getParentFolderPath(track.path);
    const folderName = getParentFolderName(track.path);
    const existing = groups.get(folderPath);

    if (existing) {
      existing.tracks.push(track);
    } else {
      groups.set(folderPath, { folderPath, folderName, tracks: [track] });
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      tracks: [...group.tracks].sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.folderName.localeCompare(b.folderName));
}

export function folderAccentColor(folderName: string): string {
  let hash = 0;
  for (const char of folderName) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 55% 42%)`;
}

export function collectionArtist(tracks: MediaItem[]): string {
  const artists = new Set(
    tracks.map((track) => track.artist?.trim()).filter((artist): artist is string => Boolean(artist)),
  );
  if (artists.size === 0) return "Unknown artist";
  if (artists.size === 1) return [...artists][0];
  return "Various artists";
}
