use tauri::AppHandle;

use super::engine;
use super::model::LibraryData;

#[tauri::command]
pub fn storage_load(app: AppHandle) -> Result<LibraryData, String> {
    engine::load(&app).map_err(String::from)
}

#[tauri::command]
pub fn storage_save(app: AppHandle, data: LibraryData) -> Result<(), String> {
    engine::save(&app, &data).map_err(String::from)
}
