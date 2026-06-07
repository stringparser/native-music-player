#[derive(Debug, thiserror::Error)]
pub enum StorageError {
    #[error("storage I/O error: {0}")]
    Io(String),

    #[error("storage parse error: {0}")]
    Parse(String),
}

impl From<StorageError> for String {
    fn from(value: StorageError) -> Self {
        value.to_string()
    }
}
