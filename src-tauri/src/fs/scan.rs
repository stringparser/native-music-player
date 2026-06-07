use std::collections::HashSet;
use std::io;
use std::path::{Path, PathBuf};

const AUDIO_EXTENSIONS: &[&str] = &["mp3", "flac", "ogg", "wav", "aac", "m4a", "opus", "wma"];

fn has_audio_extension(path: &Path) -> bool {
    path.extension()
        .and_then(|ext| ext.to_str())
        .is_some_and(|ext| AUDIO_EXTENSIONS.iter().any(|known| ext.eq_ignore_ascii_case(known)))
}

pub fn scan_audio_paths(sources: Vec<String>) -> Result<Vec<String>, String> {
    let mut collected = Vec::new();
    let mut seen = HashSet::new();

    for source in sources {
        let path = PathBuf::from(&source);
        if !path.exists() {
            continue;
        }

        collect_audio_files(&path, &mut collected, &mut seen).map_err(|error| error.to_string())?;
    }

    collected.sort();
    Ok(collected)
}

fn collect_audio_files(path: &Path, collected: &mut Vec<String>, seen: &mut HashSet<String>) -> io::Result<()> {
    if path.is_file() {
        if has_audio_extension(path) {
            let path_string = path.to_string_lossy().into_owned();
            if seen.insert(path_string.clone()) {
                collected.push(path_string);
            }
        }
        return Ok(());
    }

    if path.is_dir() {
        for entry in std::fs::read_dir(path)? {
            collect_audio_files(&entry?.path(), collected, seen)?;
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::PathBuf;

    fn temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("native-music-player-{name}-{}", uuid::Uuid::new_v4()));
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn scan_walks_subfolders_and_skips_non_audio() {
        let root = temp_dir("scan");
        let album = root.join("album-a");
        let nested = album.join("disc-1");
        fs::create_dir_all(&nested).unwrap();
        fs::write(album.join("readme.txt"), "nope").unwrap();
        fs::write(nested.join("one.mp3"), b"fake").unwrap();
        fs::write(nested.join("two.FLAC"), b"fake").unwrap();

        let paths = scan_audio_paths(vec![root.to_string_lossy().into_owned()]).unwrap();

        assert_eq!(paths.len(), 2);
        assert!(paths.iter().any(|path| path.ends_with("one.mp3")));
        assert!(paths.iter().any(|path| path.ends_with("two.FLAC")));

        let _ = fs::remove_dir_all(root);
    }

    #[test]
    fn scan_accepts_files_and_deduplicates() {
        let root = temp_dir("scan-file");
        let track = root.join("track.wav");
        fs::write(&track, b"fake").unwrap();

        let source = track.to_string_lossy().into_owned();
        let paths = scan_audio_paths(vec![source.clone(), source.clone()]).unwrap();

        assert_eq!(paths, vec![source]);

        let _ = fs::remove_dir_all(root);
    }
}
