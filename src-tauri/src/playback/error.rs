#[derive(Debug, thiserror::Error)]
pub enum PlaybackError {
    #[error("failed to open file: {0}")]
    Open(String),

    #[error("unsupported audio format")]
    Unsupported,

    #[error("no audio output device available")]
    NoOutput,

    #[error("playback error: {0}")]
    Other(String),
}

impl From<PlaybackError> for String {
    fn from(value: PlaybackError) -> Self {
        value.to_string()
    }
}
