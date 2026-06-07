import { invoke } from "@tauri-apps/api/core";
import type { MediaItem } from "../model/types";

export const MetadataClient = {
  extract(paths: string[]): Promise<MediaItem[]> {
    return invoke<MediaItem[]>("metadata_extract", { paths });
  },
};
