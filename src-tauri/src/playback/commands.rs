use std::sync::Mutex;

use tauri::{AppHandle, Manager, State};

use super::engine::{emit_playback_error, PlaybackEngine, PlaybackStatusPayload};
use super::error::PlaybackError;

pub struct PlaybackState {
    pub engine: PlaybackEngine,
}

#[tauri::command]
pub fn playback_play(
    app: AppHandle,
    state: State<'_, Mutex<PlaybackState>>,
    path: String,
) -> Result<(), String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    guard.engine.play(&app, &path).map_err(|err| {
        let message = err.to_string();
        emit_playback_error(&app, message.clone(), Some(path));
        message
    })
}

#[tauri::command]
pub fn playback_pause(
    app: AppHandle,
    state: State<'_, Mutex<PlaybackState>>,
) -> Result<(), String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    guard.engine.pause(&app).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn playback_resume(
    app: AppHandle,
    state: State<'_, Mutex<PlaybackState>>,
) -> Result<(), String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    guard.engine.resume(&app).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn playback_stop(
    app: AppHandle,
    state: State<'_, Mutex<PlaybackState>>,
) -> Result<(), String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    guard.engine.stop(&app).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn playback_seek(
    app: AppHandle,
    state: State<'_, Mutex<PlaybackState>>,
    position_ms: u64,
) -> Result<(), String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    guard.engine.seek(&app, position_ms).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn playback_set_volume(
    state: State<'_, Mutex<PlaybackState>>,
    volume: u32,
) -> Result<(), String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    guard.engine.set_volume(volume);
    Ok(())
}

#[tauri::command]
pub fn playback_status(
    state: State<'_, Mutex<PlaybackState>>,
) -> Result<PlaybackStatusPayload, String> {
    let guard = state.lock().map_err(|e| e.to_string())?;
    Ok(guard.engine.status())
}

pub fn init_playback(app: &AppHandle) -> Result<(), PlaybackError> {
    let (engine, stream) = PlaybackEngine::new()?;
    std::mem::forget(stream);
    app.manage(Mutex::new(PlaybackState { engine }));
    Ok(())
}
