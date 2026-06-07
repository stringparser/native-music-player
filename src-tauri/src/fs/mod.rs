mod scan;

#[tauri::command]
pub fn fs_scan_audio_paths(sources: Vec<String>) -> Result<Vec<String>, String> {
    scan::scan_audio_paths(sources)
}
