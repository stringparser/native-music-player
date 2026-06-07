use std::collections::VecDeque;
use std::fs::File;
use std::path::Path;
use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::Duration;

use rodio::Source;
use symphonia::core::audio::{AudioBufferRef, Signal};
use symphonia::core::codecs::{Decoder, DecoderOptions};
use symphonia::core::errors::Error as SymphoniaError;
use symphonia::core::formats::{FormatOptions, FormatReader, SeekMode, SeekTo};
use symphonia::core::io::MediaSourceStream;
use symphonia::core::meta::MetadataOptions;
use symphonia::core::probe::Hint;
use symphonia::core::units::Time;

use super::error::PlaybackError;

pub struct SymphoniaSource {
    format: Box<dyn FormatReader>,
    track_id: u32,
    decoder: Box<dyn Decoder>,
    sample_rate: u32,
    channels: u16,
    buffer: VecDeque<f32>,
    position_ms: Arc<AtomicU64>,
    duration_ms: u64,
    finished: bool,
}

impl SymphoniaSource {
    pub fn open(path: &str, position_ms: Arc<AtomicU64>) -> Result<Self, PlaybackError> {
        let path_obj = Path::new(path);
        let file = File::open(path_obj).map_err(|e| PlaybackError::Open(e.to_string()))?;
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
            .map_err(|e| PlaybackError::Open(e.to_string()))?;

        let format = probed.format;
        let track = format
            .default_track()
            .ok_or(PlaybackError::Unsupported)?;

        let track_id = track.id;
        let sample_rate = track
            .codec_params
            .sample_rate
            .ok_or(PlaybackError::Unsupported)?;
        let channels = track
            .codec_params
            .channels
            .map(|c| c.count())
            .unwrap_or(2) as u16;

        let duration_ms = track
            .codec_params
            .n_frames
            .map(|frames| frames * 1000 / u64::from(sample_rate))
            .unwrap_or(0);

        let decoder = symphonia::default::get_codecs()
            .make(&track.codec_params, &DecoderOptions::default())
            .map_err(|e| PlaybackError::Open(e.to_string()))?;

        let mut source = Self {
            format,
            track_id,
            decoder,
            sample_rate,
            channels,
            buffer: VecDeque::with_capacity(8192),
            position_ms: Arc::clone(&position_ms),
            duration_ms,
            finished: false,
        };

        if position_ms.load(Ordering::Relaxed) > 0 {
            source.seek_to_ms(position_ms.load(Ordering::Relaxed))?;
        }

        Ok(source)
    }

    pub fn duration_ms(&self) -> u64 {
        self.duration_ms
    }

    fn seek_to_ms(&mut self, ms: u64) -> Result<(), PlaybackError> {
        let clamped = ms.min(self.duration_ms);
        let time = Time::from(clamped as f64 / 1000.0);
        self.format
            .seek(
                SeekMode::Accurate,
                SeekTo::Time {
                    time,
                    track_id: Some(self.track_id),
                },
            )
            .map_err(|e| PlaybackError::Other(e.to_string()))?;
        self.decoder.reset();
        self.buffer.clear();
        self.finished = false;
        self.position_ms.store(clamped, Ordering::Relaxed);
        Ok(())
    }

    fn decode_more(&mut self) -> Result<bool, PlaybackError> {
        if self.finished {
            return Ok(false);
        }

        loop {
            let packet = match self.format.next_packet() {
                Ok(packet) => packet,
                Err(SymphoniaError::ResetRequired) => {
                    self.decoder.reset();
                    continue;
                }
                Err(SymphoniaError::IoError(_)) => {
                    self.finished = true;
                    return Ok(false);
                }
                Err(e) => return Err(PlaybackError::Other(e.to_string())),
            };

            if packet.track_id() != self.track_id {
                continue;
            }

            let decoded = self
                .decoder
                .decode(&packet)
                .map_err(|e| PlaybackError::Other(e.to_string()))?;

            append_decoded(
                &mut self.buffer,
                &self.position_ms,
                self.sample_rate,
                self.channels,
                decoded,
            );
            return Ok(true);
        }
    }
}

fn append_decoded(
    buffer: &mut VecDeque<f32>,
    position_ms: &Arc<AtomicU64>,
    sample_rate: u32,
    channels: u16,
    decoded: AudioBufferRef<'_>,
) {
    let channel_count = decoded.spec().channels.count();
    let frames = decoded.frames();

    for frame_idx in 0..frames {
        for ch in 0..channel_count {
            let sample = sample_to_f32(&decoded, ch, frame_idx);
            buffer.push_back(sample);
        }
    }

    let samples_per_ms = u64::from(sample_rate) * u64::from(channels) / 1000;
    if samples_per_ms > 0 {
        let added_ms = (frames as u64 * u64::from(channels)) / samples_per_ms;
        position_ms.fetch_add(added_ms, Ordering::Relaxed);
    }
}

fn sample_to_f32(decoded: &AudioBufferRef<'_>, ch: usize, frame_idx: usize) -> f32 {
    match decoded {
        AudioBufferRef::F32(buf) => buf.chan(ch)[frame_idx],
        AudioBufferRef::U8(buf) => (f32::from(buf.chan(ch)[frame_idx]) - 128.0) / 128.0,
        AudioBufferRef::U16(buf) => f32::from(buf.chan(ch)[frame_idx]) / 32768.0,
        AudioBufferRef::S16(buf) => f32::from(buf.chan(ch)[frame_idx]) / 32768.0,
        AudioBufferRef::S32(buf) => buf.chan(ch)[frame_idx] as f32 / 2_147_483_648.0,
        AudioBufferRef::F64(buf) => buf.chan(ch)[frame_idx] as f32,
        _ => 0.0,
    }
}

impl Iterator for SymphoniaSource {
    type Item = f32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.buffer.is_empty() {
            match self.decode_more() {
                Ok(true) => {}
                Ok(false) => return None,
                Err(_) => return None,
            }
        }

        self.buffer.pop_front()
    }
}

impl Source for SymphoniaSource {
    fn sample_rate(&self) -> u32 {
        self.sample_rate
    }

    fn channels(&self) -> u16 {
        self.channels
    }

    fn current_frame_len(&self) -> Option<usize> {
        None
    }

    fn total_duration(&self) -> Option<Duration> {
        if self.duration_ms > 0 {
            Some(Duration::from_millis(self.duration_ms))
        } else {
            None
        }
    }
}
