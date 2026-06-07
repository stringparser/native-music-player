# Album Art

Display cover artwork for the current track and in library/queue rows.

## Ideas

- Extract embedded artwork via symphonia in Rust
- Show cover in player bar and/or dedicated now-playing panel
- Fallback placeholder when no art is available

## Touches

- `src-tauri` metadata module
- `playback` and `library` feature UIs

## Depends on

- Phase 2 (playback)
- Phase 3 (metadata extraction)

## Status

Deferred from Phase 5 UI polish.
