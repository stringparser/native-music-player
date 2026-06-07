import { FileDialogClient } from "../clients/file-dialog.client";
import { MediaScanClient } from "../clients/media-scan.client";

export const mediaScanService = {
  async pickFolders(): Promise<string[]> {
    return FileDialogClient.pickAudioFolders();
  },

  async collectAudioPaths(sources: string[]): Promise<string[]> {
    if (sources.length === 0) return [];
    return MediaScanClient.scanAudioPaths(sources);
  },

  async pickFoldersAndCollectPaths(): Promise<string[]> {
    const folders = await this.pickFolders();
    return this.collectAudioPaths(folders);
  },
};
