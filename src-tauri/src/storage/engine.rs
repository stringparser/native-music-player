use std::fs;
use std::path::PathBuf;

use tauri::AppHandle;
use tauri::Manager;

use super::error::StorageError;
use super::model::LibraryData;

const STORAGE_FILE: &str = "library.json";

pub fn storage_path(app: &AppHandle) -> Result<PathBuf, StorageError> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| StorageError::Io(e.to_string()))?;
    Ok(dir.join(STORAGE_FILE))
}

pub fn load(app: &AppHandle) -> Result<LibraryData, StorageError> {
    let path = storage_path(app)?;
    if !path.exists() {
        return Ok(LibraryData::default());
    }

    let contents = fs::read_to_string(&path).map_err(|e| StorageError::Io(e.to_string()))?;
    let data: LibraryData =
        serde_json::from_str(&contents).map_err(|e| StorageError::Parse(e.to_string()))?;

    Ok(data.filter_missing_files())
}

pub fn save(app: &AppHandle, data: &LibraryData) -> Result<(), StorageError> {
    let path = storage_path(app)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| StorageError::Io(e.to_string()))?;
    }

    let contents =
        serde_json::to_string_pretty(data).map_err(|e| StorageError::Parse(e.to_string()))?;
    fs::write(&path, contents).map_err(|e| StorageError::Io(e.to_string()))?;
    Ok(())
}
