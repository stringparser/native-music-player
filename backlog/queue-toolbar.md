# Queue Toolbar

Dedicated toolbar/header for queue actions.

## Ideas

- Section header with queue title and track count
- **Remove selected** — bulk remove without row action
- **Clear queue** — may live in table header or toolbar (see current inline clear control)
- Future: save queue as playlist, shuffle toggle, play queue

## Notes

Queue header was removed in favour of a minimal table-only layout. Row actions handle reorder and remove; clear is in the actions column header. This story covers bringing back a richer queue control strip if needed.

## Touches

- `library` feature (`QueueTab`, shared `SectionToolbar`)

## Depends on

- Phase 4 (queue workflows)
