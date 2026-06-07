import type { MediaItem } from "../model/types";
import { FileDialogClient } from "../clients/file-dialog.client";
import { MetadataImportService } from "./storage.service";

export const LibraryImportService = {
  async pickAndImport(): Promise<MediaItem[]> {
    const paths = await FileDialogClient.pickAudioFiles();
    return MetadataImportService.extractFromPaths(paths);
  },
};
