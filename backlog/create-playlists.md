# Create Playlists

UI for creating and managing saved playlists in the library.

## Ideas

- New playlist action (toolbar, context menu, or dedicated panel)
- Name dialog / inline rename
- Add selected tracks or drag tracks into a playlist
- Empty state when no playlists exist

## Notes

Playlist **load into queue** and **delete** remain in the library UI for existing playlists. This story covers **creation** and broader playlist management UX removed during library simplification.

## Touches

- `library` feature (store, `PlaylistTable`, dialog/modal UI)

## Depends on

- Phase 4 (playlists as library entities)
