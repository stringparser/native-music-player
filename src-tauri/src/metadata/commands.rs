use crate::storage::MediaItemDto;

use super::extract;

#[tauri::command]
pub fn metadata_extract(paths: Vec<String>) -> Result<Vec<MediaItemDto>, String> {
    extract::extract_media_items(paths).map_err(String::from)
}
