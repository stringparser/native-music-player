use std::path::Path;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaItemDto {
    pub id: String,
    pub title: String,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub duration: f64,
    pub path: String,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaylistDto {
    pub id: String,
    pub name: String,
    pub track_paths: Vec<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryData {
    pub library: Vec<MediaItemDto>,
    #[serde(default)]
    pub playlists: Vec<PlaylistDto>,
    pub queue: Vec<MediaItemDto>,
}

impl LibraryData {
    pub fn filter_missing_files(mut self) -> Self {
        self.library.retain(|item| Path::new(&item.path).exists());
        self.queue.retain(|item| Path::new(&item.path).exists());
        self.playlists.iter_mut().for_each(|playlist| {
            playlist
                .track_paths
                .retain(|path| Path::new(path).exists());
        });
        self
    }
}
