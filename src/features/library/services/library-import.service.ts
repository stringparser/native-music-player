import type { MediaItem } from "../model/types";
import { mediaScanService } from "./media-scan.service";
import { MetadataImportService } from "./storage.service";

export const LibraryImportService = {
  async pickAndImport(): Promise<MediaItem[]> {
    const paths = await mediaScanService.pickFoldersAndCollectPaths();
    return MetadataImportService.extractFromPaths(paths);
  },
};
