import type { MediaItem } from "../model/types";
import { MetadataClient } from "../clients/metadata.client";
import { StorageClient } from "../clients/storage.client";
import { useLibraryStore } from "../store/library.store";
import { dedupeQueuePaths } from "./queue.service";

function dedupeByPath(existing: MediaItem[], incoming: MediaItem[]): MediaItem[] {
  const paths = new Set(existing.map((item) => item.path));
  return incoming.filter((item) => !paths.has(item.path));
}

class StorageServiceImpl {
  async hydrate(): Promise<void> {
    const data = await StorageClient.load();
    useLibraryStore
      .getState()
      .setLibraryData(data.library, data.playlists ?? [], data.queue);
    useLibraryStore.getState().setHydrated(true);
  }

  async persist(): Promise<void> {
    const { library, playlists, queue } = useLibraryStore.getState();
    await StorageClient.save({ library, playlists, queue });
  }

  mergeLibraryItems(incoming: MediaItem[]): MediaItem[] {
    const { library } = useLibraryStore.getState();
    return dedupeByPath(library, incoming);
  }

  mergeQueueItems(incoming: MediaItem[]): MediaItem[] {
    const { queue } = useLibraryStore.getState();
    return dedupeQueuePaths(queue, incoming);
  }
}

export const storageService = new StorageServiceImpl();

export const MetadataImportService = {
  async extractFromPaths(paths: string[]): Promise<MediaItem[]> {
    if (paths.length === 0) return [];
    return MetadataClient.extract(paths);
  },
};
