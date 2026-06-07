# Error Handling

User-visible feedback when something goes wrong.

## Status

**Partially done** — Phase 5 added toast notifications and a player bar error banner for playback and persistence failures.

## Remaining ideas

- Inline row state for missing/moved files
- Retry action on failed save/load
- More specific error messages per format or I/O case

## Touches

- `playback` and `library` services
- UI surfaces in player bar, toasts, content area

## Depends on

- Phase 2 (playback)
- Phase 3 (persistence)
