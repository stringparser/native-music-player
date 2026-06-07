mod fs;
mod metadata;
mod playback;
mod storage;

use fs::fs_scan_audio_paths;
use metadata::metadata_extract;
use playback::{
    init_playback, playback_pause, playback_play, playback_resume, playback_seek,
    playback_set_volume, playback_status, playback_stop,
};
use storage::{storage_load, storage_save};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            init_playback(app.handle()).map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            playback_play,
            playback_pause,
            playback_resume,
            playback_stop,
            playback_seek,
            playback_set_volume,
            playback_status,
            storage_load,
            storage_save,
            metadata_extract,
            fs_scan_audio_paths,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
