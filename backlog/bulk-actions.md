# Bulk Actions (Library & Queue)

Batch operations on selected tracks instead of per-row delete/remove buttons.

Per-row **remove from library** was removed from the Library tab UI; removal and other destructive actions should return here as bulk actions once selection exists.

## Ideas

- **Toolbar or header actions** when one or more rows are selected (e.g. “3 selected” + action buttons)
- **Library:** remove from library, add selected to queue, add to playlist (when [create-playlists](./create-playlists.md) exists)
- **Queue:** remove selected, clear selection, optional move/reorder as a group
- **Confirmations** for destructive bulk ops (especially remove from library when tracks are in the queue or playing)
- **Keyboard:** delete key removes selected from library or queue (context-dependent; see [native-polish](./native-polish.md))

## Open questions

- Shared bulk toolbar component for Library and Queue, or tab-specific actions?
- Select-all and invert selection?
- Partial failure handling (e.g. 2 of 5 removed)

## Touches

- `library` feature (store, services, Library/Queue tab UI)
- `shared/ui` (bulk action bar, selection state with [multi-select-library](./multi-select-library.md))
- `playback` (stop or skip if now-playing track is bulk-removed)

## Depends on

- [Multi-select in library](./multi-select-library.md)
- Phase 3 (persistence)
- Phase 4 (queue workflows)
