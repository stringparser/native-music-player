# Import Convenience

Faster ways to add media after core import and playback are stable.

## Ideas

- Drag & drop files onto Library / Queue
- Watch folder (auto-import new files)
- “Open folder” in addition to “Open files” via Add button

## Touches

- `library` feature (import service)
- Tauri file watcher plugin or custom watcher in Rust

## Depends on

- Phase 2 (playback)
- Phase 3 (files & persistence)
- Phase 4 (queue) — optional; drop targets onto queue
- Phase 5 (UI polish) — optional; import flow polish

## Notes

Intentionally deferred from Phase 3 — the Add button is enough for the first release.
