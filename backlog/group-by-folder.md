# Group Tracks by Folder

Browse library tracks grouped by parent folder on disk.

## Open questions

- **Presentation:** cards vs collapsible folders vs sidebar tree — leaning toward **cards** per folder but TBD
- **Grouping key:** immediate parent folder vs full path hierarchy
- **Mixed imports:** how to show tracks added from different roots
- **Interaction:** expand/collapse, play all in folder, add folder to queue

## Ideas

- Derive folder from absolute `path` on each `MediaItem`
- Optional folder card grid above or instead of flat table
- Search/filter still applies across groups
- Persist view preference (flat vs grouped)

## Touches

- `library` feature (model, services, Library tab UI)
- Possibly `shared/ui` (folder card component)

## Depends on

- Phase 3 (absolute file paths)
