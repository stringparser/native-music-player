# Error Handling

User-visible feedback when something goes wrong.

## Ideas

- Unsupported audio format
- Missing or moved file
- Playback engine errors from Rust
- Failed load / save (Phase 3 persistence)
- Simple toast, inline message, or status area — keep minimal for MVP

## Touches

- `playback` and `library` services (map client errors to domain messages)
- UI surfaces in player bar or content area

## Depends on

- Phase 2 (playback)
- Phase 3 (persistence) — for save/load errors
