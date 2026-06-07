import { open } from "@tauri-apps/plugin-dialog";

const AUDIO_EXTENSIONS = ["mp3", "flac", "ogg", "wav", "aac", "m4a", "opus", "wma"];

export const FileDialogClient = {
  async pickAudioFiles(): Promise<string[]> {
    const result = await open({
      multiple: true,
      filters: [
        {
          name: "Audio",
          extensions: AUDIO_EXTENSIONS,
        },
      ],
    });

    if (!result) return [];
    return Array.isArray(result) ? result : [result];
  },
};
