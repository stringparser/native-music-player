import { invoke } from "@tauri-apps/api/core";
import type { LibraryData } from "../model/types";

export const StorageClient = {
  load(): Promise<LibraryData> {
    return invoke<LibraryData>("storage_load");
  },

  save(data: LibraryData): Promise<void> {
    return invoke("storage_save", { data });
  },
};
