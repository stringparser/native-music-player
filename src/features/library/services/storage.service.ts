import type { MediaItem } from "../model/types";
import { MetadataClient } from "../clients/metadata.client";
import { StorageClient } from "../clients/storage.client";
import { toastService } from "../../../shared/services/toast.service";
import { useStatusStore } from "../../../shared/store/status.store";
import { useLibraryStore } from "../store/library.store";
import { dedupeQueuePaths } from "./queue.service";

function dedupeByPath(existing: MediaItem[], incoming: MediaItem[]): MediaItem[] {
  const paths = new Set(existing.map((item) => item.path));
  return incoming.filter((item) => !paths.has(item.path));
}

class StorageServiceImpl {
  async hydrate(): Promise<void> {
    useStatusStore.getState().setLoading(true, "Loading library…");

    try {
      const data = await StorageClient.load();
      useLibraryStore
        .getState()
        .setLibraryData(data.library, data.playlists ?? [], data.queue);
      useLibraryStore.getState().setHydrated(true);
    } catch {
      toastService.error("Failed to load library");
    } finally {
      useStatusStore.getState().setLoading(false);
    }
  }

  async persist(): Promise<boolean> {
    const { library, playlists, queue } = useLibraryStore.getState();

    try {
      await StorageClient.save({ library, playlists, queue });
      return true;
    } catch {
      toastService.error("Failed to save library");
      return false;
    }
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
