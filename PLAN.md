# Native Music Player — Development Plan

A Tauri + React + Zustand native music player. VLC-inspired layout, dark theme, feature-based frontend structure.

**Stack:** Tauri 2, TypeScript, React, Zustand, Rust (`symphonia` + `rodio` for playback)

**Planning docs:**

- `PLAN.md` (this file) — active phases only
- [`backlog/`](./backlog/) — deferred features, one markdown file per item (see [`backlog/README.md`](./backlog/README.md))

---

## Product model

| Concept | Role |
|---------|------|
| **Library** | All media the user owns — tracks and saved **playlists** (playlist files live here too) |
| **Queue** | What plays **now** — built from single tracks and/or playlists from the library |

The **Queue** tab shows the current play order. Phase 4 adds full queue workflows (load playlist into queue, reorder, etc.). Until then, Add on the Queue tab appends tracks directly.

---

## MVP

**MVP = Phase 1 ✅ + Phase 2 + Phase 3**

- Add music with real file paths
- Library and queue persist across restarts
- Play audio from the queue via Rust

Phase 4 (queue features) and Phase 5 (UI polish) are post-MVP. See [`backlog/`](./backlog/) for smaller items (remove tracks, double-click play, errors) that can land alongside Phases 2–3 or shortly after.

---

## Engineering principles

These apply to **every phase** — not optional polish. Features should be implemented with maintainable structure from the start.

### Domain-driven design (DDD)

Organize code by **bounded context** (domain), not by technical layer alone.

```
src/features/<domain>/
  model/       # types, entities, config
  store/       # repository — in-memory state + actions (Zustand)
  services/    # domain logic, orchestration, caching; uses clients
  clients/     # I/O only — Tauri invoke, plugins, events (*.client.ts)
  ui/          # React components for this domain
  index.ts     # public API — other features import only from here
```

- **`app/`** composes features; it does not own business logic.
- **`shared/`** holds cross-cutting utilities and reusable UI — not domain rules.
- Cross-feature coordination goes through **public APIs** (`index.ts`) or explicit services, not deep imports into another feature’s internals.
- Rust mirrors this in `src-tauri/`: separate modules per concern (e.g. `playback`, `persistence`, `metadata`).

### SOLID

Use SOLID as a decision guide when adding or changing code:

| Principle | In practice |
|-----------|-------------|
| **S**ingle responsibility | A module/class does one job (e.g. export formatting ≠ file picking ≠ playback control). |
| **O**pen/closed | Extend via new implementations or services; avoid editing unrelated code paths. |
| **L**iskov substitution | Swappable implementations (e.g. mock client in tests, real Tauri client in app). |
| **I**nterface segregation | Small, focused types/interfaces — don’t force consumers to depend on methods they don’t use. |
| **D**ependency inversion | Components depend on the store; the store depends on services; services depend on client abstractions — never on raw `invoke()` or DOM APIs. |

### Layers: repository, service, client

**Do not call Tauri (`invoke`, plugins) directly from React components or store actions.**

| Layer | Role | Example |
|-------|------|---------|
| **Store (repository)** | In-memory state and actions exposed to the UI | `useLibraryStore`, `usePlaybackStore` |
| **Service** | Domain logic, caching, orchestration; **uses clients** | `PlaybackService`, `StorageService`, `LibraryImportService` |
| **Client** | **I/O only** — `invoke`, plugins, event streams | `PlaybackClient`, `StorageClient`, `FileDialogClient` |

**Store as repository**

The Zustand store is the **repository** for the frontend: it holds the current domain state and is the only thing components talk to. Store actions delegate work to services and write results back into state. They do not call Tauri themselves.

**Clients handle I/O**

Clients are thin, reusable wrappers over the backend boundary:

- Expose a narrow API (`play(path)`, `saveLibrary(data)`, `pickFiles()`)
- Hide command names, serialization, and error mapping
- Can be mocked in tests

**Services use clients**

Services contain business rules and caching (e.g. skip redundant loads). They call one or more clients and return domain-shaped results to the store.

**Example — playback**

```
features/playback/clients/playback.client.ts      # PlaybackClient — I/O only
features/playback/services/playback.service.ts    # PlaybackService — uses PlaybackClient
features/playback/store/playback.store.ts           # repository — actions call PlaybackService
```

**Example — persistence (Phase 3)**

```
features/library/clients/storage.client.ts          # StorageClient — load/save via Tauri
features/library/services/storage.service.ts        # StorageService — uses StorageClient; caching, mapping
features/library/store/library.store.ts             # repository — hydrate/persist via StorageService
```

**Data flow**

```
components → store (repository) → service → client → Tauri
```

- **Components** — read store state, dispatch store actions only.
- **Store** — repository; actions call services, update state with results.
- **Service** — caching, orchestration, when to I/O; uses clients.
- **Client** — all backend I/O.

Event listeners (playback position, errors) are subscribed in a **service** (via a client) and push updates into the **store**.

**Example (Rust):**

- Tauri commands stay thin; delegate to domain modules.
- Playback engine, persistence, and metadata are separate types/modules with clear boundaries.

### When implementing a feature

1. Identify the **domain** it belongs to.
2. Add **model + client + service + store (repository)** before wiring UI.
3. Wire **store → service → client**; introduce clients/services as part of the phase — not a later cleanup.
4. Keep components thin: render store state and dispatch store actions only.

---

## Phase 1 — UI Shell ✅

**Status:** Done

- Tab bar: Library / **Queue**
- Shared Add + Search in tab bar
- Media tables and empty states
- Player bar (UI only — not wired to Rust yet)
- Feature-based folder structure (`src/features/`, `src/app/`, `src/shared/`)
- Makefile for project scripts (`make dev`, `make build`, etc.)

---

## Phase 2 — Playback (Rust)

**Goal:** Real audio playback with stable cross-platform format support.

**Status:** Done

### Decision

Use a **Rust backend**, not browser/WebView playback.

- More consistent format support across macOS, Windows, and Linux
- Avoids WebView codec differences (e.g. OGG/FLAC gaps in WKWebView)
- Rust owns media; React owns UI

### Stack

- **`symphonia`** — decode (MP3, FLAC, OGG, WAV, AAC, etc.)
- **`rodio`** — audio output

### Scope

- Tauri commands: `play`, `pause`, `stop`, `seek`, `set_volume`
- Events to frontend: position, duration, ended, errors
- Wire player bar and row selection → play selected track
- Queue-driven playback: next / prev / stop
- Highlight “now playing” in the media table
- **Real file paths** — `FileDialogClient` + native Tauri dialogs (replace HTML file input) so Rust can open files on disk
- Add to library or queue with absolute paths

### Notes

Persistence comes in Phase 3. Phase 2 must still resolve real paths — playback cannot rely on browser file names alone.

Deferred to [`backlog/`](./backlog/): [double-click play](./backlog/double-click-play.md), [error handling UI](./backlog/error-handling.md) (basic errors should still be attempted in this phase where practical).

### Touches

- `playback` feature — **`PlaybackClient`** → **`PlaybackService`** → **`usePlaybackStore`** (repository)
- `library` feature — **`FileDialogClient`** → **`LibraryImportService`** → **`useLibraryStore`**
- `src-tauri` playback module (commands delegate to playback engine)

---

## Phase 3 — Native Files & Persistence

**Goal:** Library and queue survive app restarts.

**Status:** Done

### Scope

- Persist library and queue (SQLite or JSON via Tauri)
- Store absolute file paths; dedupe by path
- Metadata extraction in Rust (`symphonia`): duration, title, artist, album
- Hydrate store on app launch via **`StorageClient`** → **`StorageService`**

### Notes

`symphonia` is already in the project from Phase 2 — reuse it for metadata. Stored paths must match what playback uses.

### Touches

- `library` feature — **`StorageClient`** → **`StorageService`** → **`useLibraryStore`** (repository)
- Persistence layer in `src-tauri` (storage engine behind `StorageClient`)

---

## Phase 4 — Queue

**Goal:** Full queue workflows — build what plays now from the library using tracks and playlists.

**Status:** Done

### Scope

- Library holds tracks **and** saved playlists (playlist as a library entity)
- Load a playlist from library into the queue
- Add single tracks from library to queue (without duplicating file references)
- Queue ordering: reorder, remove item, clear queue
- Playback consumes the queue (next/prev already wired in Phase 2; extend as needed)

### Notes

This is where the Library / Queue split pays off: library = collection, queue = session play order.

Deferred to [`backlog/`](./backlog/): [remove tracks](./backlog/remove-tracks.md) may overlap — implement here if it fits queue/library removal.

### Touches

- `library` feature (model for playlists, queue service)
- `playback` feature (queue as playback source)

---

## Phase 5 — UI Polish

**Goal:** Refine the frontend once core functionality works end-to-end.

**Status:** Done

### Scope

**Refactor reusable components**

- Extract shared UI primitives into `src/shared/ui/` (buttons, toolbars, tables, empty states)
- Reduce duplication across Library / Queue tabs and features
- Consistent props and patterns across features

**Improve UI**

- Visual polish: spacing, typography, states (hover, active, disabled, loading)
- Clearer hierarchy and alignment across tab bar, tables, and player bar
- Empty states, errors, and playback states that look intentional
- Responsive layout tweaks for smaller windows

**Improve UX**

- Smoother flows: add → play, select → play, tab switching with context preserved
- Clear feedback: now playing, loading, errors, empty library / queue
- Keyboard-friendly controls where it helps (focus, basic navigation)
- Small friction fixes discovered during earlier phases

### Notes

Phase 5 is **frontend look-and-feel**, not OS integration — keyboard shortcuts, media keys, and settings stay in [`backlog/native-polish.md`](./backlog/native-polish.md).

### Touches

- `src/shared/ui/`
- `library`, `playback`, `navigation` feature UIs
- `app/styles/global.css`

---

## Phase Order

```
Phase 1 (UI) ✅ → Phase 2 (Playback + real paths) → Phase 3 (Persistence) → Phase 4 (Queue) → Phase 5 (UI Polish)
```

| Phase | Effort       | User-visible outcome                              |
|-------|--------------|---------------------------------------------------|
| 2     | Medium–Large | Add files, press play, hear music via Rust        |
| 3     | Medium       | Restart app, library and queue still there        |
| 4     | Medium       | Build queue from library tracks and playlists     |
| 5     | Medium       | App feels cohesive, clear, and pleasant to use  |

**MVP:** Phases 1–3.

---

## Backlog

After Phase 5 (or alongside Phases 2–3 for small items), pick up work from the **`backlog/`** folder. Index: [`backlog/README.md`](./backlog/README.md).

| Backlog item | File |
|--------------|------|
| Remove tracks | [`backlog/remove-tracks.md`](./backlog/remove-tracks.md) |
| Double-click to play | [`backlog/double-click-play.md`](./backlog/double-click-play.md) |
| Error handling | [`backlog/error-handling.md`](./backlog/error-handling.md) |
| Library organization | [`backlog/library-organization.md`](./backlog/library-organization.md) |
| Import convenience | [`backlog/import-convenience.md`](./backlog/import-convenience.md) |
| Native polish (OS) | [`backlog/native-polish.md`](./backlog/native-polish.md) |
| Notes | [`backlog/notes.md`](./backlog/notes.md) |
| Playback enhancements | [`backlog/playback-enhancements.md`](./backlog/playback-enhancements.md) |
| Video playback | [`backlog/video-playback.md`](./backlog/video-playback.md) |
| Streaming / network | [`backlog/streaming-network-sources.md`](./backlog/streaming-network-sources.md) |
| Cloud sync | [`backlog/cloud-sync.md`](./backlog/cloud-sync.md) |

---

## Commands

```bash
make install    # Install dependencies
make dev        # Run Tauri + Vite in development
make build      # Production build
make check      # Type-check frontend
make help       # List all targets
```
