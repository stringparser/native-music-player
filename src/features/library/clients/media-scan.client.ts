import { invoke } from "@tauri-apps/api/core";

export const MediaScanClient = {
  scanAudioPaths(sources: string[]): Promise<string[]> {
    return invoke<string[]>("fs_scan_audio_paths", { sources });
  },
};
