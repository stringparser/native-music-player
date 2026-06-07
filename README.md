# Native Music Player

A native desktop music player built with **Tauri 2**, **React**, and **Rust**. Browse your library by folder, build a queue, and play audio locally with a dark, minimal UI.

## Features

- **Library** — import folders recursively; tracks are grouped by parent folder on disk
- **Queue** — table view with reorder, remove, and clear-all
- **Playback** — play/pause, seek, volume, previous/next from the queue
- **Persistence** — library and queue saved to disk between sessions
- **Search** — filter library and queue by title, artist, album, or folder name

Supported audio formats include MP3, FLAC, OGG, WAV, AAC, M4A, Opus, and WMA.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- Platform dependencies for [Tauri 2](https://v2.tauri.app/start/prerequisites/)

## Development

Install dependencies:

```bash
npm install
```

Run the app in development mode (starts the Vite dev server and Tauri window):

```bash
npm run tauri dev
```

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend only (Vite) |
| `npm run build` | Type-check and build frontend |
| `npm run check` | TypeScript check only |
| `npm run tauri build` | Production app bundle |

## Usage

1. Open the **Library** tab and click **Add** to select one or more folders.
2. Subfolders are scanned automatically for audio files.
3. Click **+** on a track or **Add all to queue** for a folder to build the queue.
4. Double-click a track to play it (adds to the queue if needed).
5. Use the folder **Play** button to replace the queue with that folder and start playback.
6. Switch to **Queue** to reorder or remove tracks before they play.

## Architecture

The frontend is organized by feature under `src/features/` (library, playback, navigation). UI talks to Zustand stores, which call services, which call Tauri clients — components never invoke Rust directly.

Rust lives in `src-tauri/`:

- `playback/` — decode (symphonia) and output (rodio)
- `metadata/` — tag and duration extraction
- `storage/` — JSON persistence
- `fs/` — recursive folder scanning

See [`PLAN.md`](./PLAN.md) for the development plan and [`backlog/`](./backlog/) for deferred features (playlists UI, bulk actions, album art, and more).

## License

Private project — no license specified yet.
