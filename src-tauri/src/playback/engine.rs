use std::sync::atomic::{AtomicBool, AtomicU32, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};

use rodio::{OutputStream, OutputStreamHandle, Sink};
use serde::Serialize;
use tauri::{AppHandle, Emitter};

use super::error::PlaybackError;
use super::source::SymphoniaSource;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaybackPositionPayload {
    pub position_ms: u64,
    pub duration_ms: u64,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaybackStatePayload {
    pub is_playing: bool,
    pub is_paused: bool,
    pub path: Option<String>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaybackStatusPayload {
    pub position_ms: u64,
    pub duration_ms: u64,
    pub is_playing: bool,
    pub is_paused: bool,
    pub path: Option<String>,
    pub ended: bool,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlaybackErrorPayload {
    pub message: String,
    pub path: Option<String>,
}

pub struct PlaybackEngine {
    stream_handle: OutputStreamHandle,
    sink: Mutex<Option<Sink>>,
    volume: AtomicU32,
    position_ms: Arc<AtomicU64>,
    duration_ms: AtomicU64,
    is_playing: AtomicBool,
    is_paused: AtomicBool,
    current_path: Mutex<Option<String>>,
}

impl PlaybackEngine {
    pub fn new() -> Result<(Self, OutputStream), PlaybackError> {
        let (stream, stream_handle) =
            OutputStream::try_default().map_err(|_| PlaybackError::NoOutput)?;

        Ok((
            Self {
                stream_handle,
                sink: Mutex::new(None),
                volume: AtomicU32::new(80),
                position_ms: Arc::new(AtomicU64::new(0)),
                duration_ms: AtomicU64::new(0),
                is_playing: AtomicBool::new(false),
                is_paused: AtomicBool::new(false),
                current_path: Mutex::new(None),
            },
            stream,
        ))
    }

    pub fn play(&self, app: &AppHandle, path: &str) -> Result<(), PlaybackError> {
        self.stop_internal(false);

        self.position_ms.store(0, Ordering::Relaxed);
        let source = SymphoniaSource::open(path, Arc::clone(&self.position_ms))?;
        let duration = source.duration_ms();
        self.duration_ms.store(duration, Ordering::Relaxed);

        let sink = Sink::try_new(&self.stream_handle).map_err(|e| PlaybackError::Other(e.to_string()))?;
        let volume = self.volume.load(Ordering::Relaxed) as f32 / 100.0;
        sink.set_volume(volume);
        sink.append(source);

        *self.sink.lock().map_err(|e| PlaybackError::Other(e.to_string()))? = Some(sink);
        *self.current_path.lock().map_err(|e| PlaybackError::Other(e.to_string()))? =
            Some(path.to_string());
        self.is_playing.store(true, Ordering::Relaxed);
        self.is_paused.store(false, Ordering::Relaxed);

        self.emit_state(app);
        self.emit_position(app);

        Ok(())
    }

    pub fn pause(&self, app: &AppHandle) -> Result<(), PlaybackError> {
        if let Some(sink) = self.sink.lock().map_err(|e| PlaybackError::Other(e.to_string()))?.as_ref() {
            sink.pause();
            self.is_playing.store(false, Ordering::Relaxed);
            self.is_paused.store(true, Ordering::Relaxed);
            self.emit_state(app);
        }
        Ok(())
    }

    pub fn resume(&self, app: &AppHandle) -> Result<(), PlaybackError> {
        if let Some(sink) = self.sink.lock().map_err(|e| PlaybackError::Other(e.to_string()))?.as_ref() {
            sink.play();
            self.is_playing.store(true, Ordering::Relaxed);
            self.is_paused.store(false, Ordering::Relaxed);
            self.emit_state(app);
        }
        Ok(())
    }

    pub fn stop(&self, app: &AppHandle) -> Result<(), PlaybackError> {
        self.stop_internal(true);
        self.emit_state(app);
        self.emit_position(app);
        Ok(())
    }

    pub fn seek(&self, app: &AppHandle, position_ms: u64) -> Result<(), PlaybackError> {
        let path = self
            .current_path
            .lock()
            .map_err(|e| PlaybackError::Other(e.to_string()))?
            .clone()
            .ok_or_else(|| PlaybackError::Other("nothing is playing".into()))?;

        self.stop_internal(false);
        self.position_ms.store(position_ms, Ordering::Relaxed);

        let source = SymphoniaSource::open(&path, Arc::clone(&self.position_ms))?;
        let duration = source.duration_ms();
        self.duration_ms.store(duration, Ordering::Relaxed);

        let sink = Sink::try_new(&self.stream_handle).map_err(|e| PlaybackError::Other(e.to_string()))?;
        let volume = self.volume.load(Ordering::Relaxed) as f32 / 100.0;
        sink.set_volume(volume);
        sink.append(source);

        *self.sink.lock().map_err(|e| PlaybackError::Other(e.to_string()))? = Some(sink);
        self.is_playing.store(true, Ordering::Relaxed);
        self.is_paused.store(false, Ordering::Relaxed);

        self.emit_state(app);
        self.emit_position(app);

        Ok(())
    }

    pub fn set_volume(&self, volume: u32) {
        let clamped = volume.min(100);
        self.volume.store(clamped, Ordering::Relaxed);
        if let Ok(guard) = self.sink.lock() {
            if let Some(sink) = guard.as_ref() {
                sink.set_volume(clamped as f32 / 100.0);
            }
        }
    }

    pub fn status(&self) -> PlaybackStatusPayload {
        let ended = self
            .sink
            .lock()
            .ok()
            .and_then(|guard| guard.as_ref().map(|sink| sink.empty()))
            .unwrap_or(false)
            && self.is_playing.load(Ordering::Relaxed)
            && !self.is_paused.load(Ordering::Relaxed);

        PlaybackStatusPayload {
            position_ms: self.position_ms.load(Ordering::Relaxed),
            duration_ms: self.duration_ms.load(Ordering::Relaxed),
            is_playing: self.is_playing.load(Ordering::Relaxed),
            is_paused: self.is_paused.load(Ordering::Relaxed),
            path: self.current_path.lock().ok().and_then(|p| p.clone()),
            ended,
        }
    }

    fn stop_internal(&self, reset_position: bool) {
        if let Ok(mut guard) = self.sink.lock() {
            if let Some(sink) = guard.take() {
                sink.stop();
            }
        }

        self.is_playing.store(false, Ordering::Relaxed);
        self.is_paused.store(false, Ordering::Relaxed);

        if reset_position {
            self.position_ms.store(0, Ordering::Relaxed);
            self.duration_ms.store(0, Ordering::Relaxed);
            if let Ok(mut path) = self.current_path.lock() {
                *path = None;
            }
        }
    }

    fn emit_state(&self, app: &AppHandle) {
        let _ = app.emit(
            "playback-state",
            PlaybackStatePayload {
                is_playing: self.is_playing.load(Ordering::Relaxed),
                is_paused: self.is_paused.load(Ordering::Relaxed),
                path: self.current_path.lock().ok().and_then(|p| p.clone()),
            },
        );
    }

    fn emit_position(&self, app: &AppHandle) {
        let _ = app.emit(
            "playback-position",
            PlaybackPositionPayload {
                position_ms: self.position_ms.load(Ordering::Relaxed),
                duration_ms: self.duration_ms.load(Ordering::Relaxed),
            },
        );
    }
}

pub fn emit_playback_error(app: &AppHandle, message: String, path: Option<String>) {
    let _ = app.emit(
        "playback-error",
        PlaybackErrorPayload { message, path },
    );
}
