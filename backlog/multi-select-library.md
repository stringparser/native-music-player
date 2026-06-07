# Multi-Select in Library

Select multiple tracks in the library at once for batch actions.

## Ideas

- **Selection model:** shift-click range, cmd/ctrl-click toggle, optional select-all
- **Visual:** checkbox column and/or highlighted rows; selected count in toolbar or status area
- **Batch actions:** add selected to queue, remove from library, add to playlist (when [create-playlists](./create-playlists.md) exists), clear selection
- **Keyboard:** shift + arrow to extend selection (optional; see [native-polish](./native-polish.md))
- **Queue tab:** consider same pattern later for reorder/remove batches

## Open questions

- Single-click still selects one row, or switch to checkbox-only selection?
- Persist selection when switching Library ↔ Queue tabs?
- Max selection feedback (e.g. “12 tracks selected”)

## Touches

- `library` feature (store selection state, `MediaTable` / `DataTable`, Library tab UI)
- Possibly `shared/ui` (selection checkbox, bulk action toolbar)

## Depends on

- Phase 4 (library + queue workflows)
