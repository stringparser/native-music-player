import { LibraryImportService } from "../../../library/services/library-import.service";
import { useLibraryStore } from "../../../library/store/library.store";
import { toastService } from "../../../../shared/services/toast.service";
import { useStatusStore } from "../../../../shared/store/status.store";
import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { tabs } from "../../model/navigation.config";
import { useNavigationStore } from "../../store/navigation.store";
import styles from "./TabBar.module.css";

export function TabBar() {
  const activeView = useNavigationStore((s) => s.activeView);
  const setActiveView = useNavigationStore((s) => s.setActiveView);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const queueLength = useLibraryStore((s) => s.queue.length);
  const setSearchQuery = useLibraryStore((s) => s.setSearchQuery);
  const addMediaToLibrary = useLibraryStore((s) => s.addMediaToLibrary);
  const addMediaToQueue = useLibraryStore((s) => s.addMediaToQueue);
  const isImporting = useStatusStore((s) => s.isImporting);
  const setImporting = useStatusStore((s) => s.setImporting);

  const handleAdd = async () => {
    setImporting(true);
    try {
      const items = await LibraryImportService.pickAndImport();
      if (items.length === 0) return;

      if (activeView === "library") {
        await addMediaToLibrary(items);
      } else {
        await addMediaToQueue(items);
      }
    } catch {
      toastService.error("Failed to import files");
    } finally {
      setImporting(false);
    }
  };

  return (
    <header className={styles.tabBar}>
      <nav className={styles.tabs} aria-label="Main navigation" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          const count = tab.id === "queue" && queueLength > 0 ? queueLength : null;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => setActiveView(tab.id)}
            >
              <span className={styles.tabLabel}>
                {tab.label}
                {count !== null && <span className={styles.tabCount}>{count}</span>}
              </span>
            </button>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <AddMediaButton onAdd={handleAdd} disabled={isImporting} loading={isImporting} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </header>
  );
}
