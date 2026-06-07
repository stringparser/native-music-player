use std::fs::File;
use std::path::Path;

use symphonia::core::formats::{FormatOptions, FormatReader};
use symphonia::core::io::MediaSourceStream;
use symphonia::core::meta::{MetadataOptions, StandardTagKey, Tag, Value};
use symphonia::core::probe::Hint;

use crate::storage::MediaItemDto;

use super::error::MetadataError;

pub fn extract_media_items(paths: Vec<String>) -> Result<Vec<MediaItemDto>, MetadataError> {
    paths
        .into_iter()
        .filter(|path| Path::new(path).exists())
        .map(|path| extract_single(&path))
        .collect()
}

fn extract_single(path: &str) -> Result<MediaItemDto, MetadataError> {
    let path_obj = Path::new(path);
    let file = File::open(path_obj).map_err(|e| MetadataError::Open(e.to_string()))?;
    let mss = MediaSourceStream::new(Box::new(file), Default::default());

    let mut hint = Hint::new();
    if let Some(ext) = path_obj.extension().and_then(|e| e.to_str()) {
        hint.with_extension(ext);
    }

    let probed = symphonia::default::get_probe()
        .format(
            &hint,
            mss,
            &FormatOptions::default(),
            &MetadataOptions::default(),
        )
        .map_err(|e| MetadataError::Open(e.to_string()))?;

    let mut format = probed.format;
    read_all_metadata(&mut format);

    let mut title = None;
    let mut artist = None;
    let mut album = None;

    if let Some(revision) = format.metadata().current() {
        for tag in revision.tags() {
            match tag.std_key {
                Some(StandardTagKey::TrackTitle) if title.is_none() => {
                    title = Some(tag_value_to_string(tag));
                }
                Some(StandardTagKey::Artist) if artist.is_none() => {
                    artist = Some(tag_value_to_string(tag));
                }
                Some(StandardTagKey::Album) if album.is_none() => {
                    album = Some(tag_value_to_string(tag));
                }
                _ => {}
            }
        }
    }

    let duration = format
        .default_track()
        .and_then(|track| {
            track
                .codec_params
                .n_frames
                .zip(track.codec_params.sample_rate)
                .map(|(frames, sample_rate)| frames as f64 / f64::from(sample_rate))
        })
        .unwrap_or(0.0);

    let fallback_title = path_obj
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or(path)
        .to_string();

    Ok(MediaItemDto {
        id: uuid::Uuid::new_v4().to_string(),
        title: title.unwrap_or(fallback_title),
        artist,
        album,
        duration,
        path: path.to_string(),
        category: "Uncategorized".to_string(),
    })
}

fn read_all_metadata(format: &mut Box<dyn FormatReader>) {
    while !format.metadata().is_latest() {
        format.metadata().pop();
    }
}

fn tag_value_to_string(tag: &Tag) -> String {
    match &tag.value {
        Value::String(s) => s.clone(),
        Value::SignedInt(i) => i.to_string(),
        Value::UnsignedInt(i) => i.to_string(),
        Value::Float(f) => f.to_string(),
        Value::Boolean(b) => b.to_string(),
        Value::Binary(_) | Value::Flag => String::new(),
    }
}
