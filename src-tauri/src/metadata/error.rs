#[derive(Debug, thiserror::Error)]
pub enum MetadataError {
    #[error("failed to open file: {0}")]
    Open(String),
}

impl From<MetadataError> for String {
    fn from(value: MetadataError) -> Self {
        value.to_string()
    }
}
