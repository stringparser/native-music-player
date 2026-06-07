import { Library, ListOrdered } from "lucide-react";
import { LibraryImportService } from "../../../library/services/library-import.service";
import { useLibraryStore } from "../../../library/store/library.store";
import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { tabs } from "../../model/navigation.config";
import type { ViewId } from "../../model/types";
import { useNavigationStore } from "../../store/navigation.store";
import styles from "./TabBar.module.css";

const tabIcons: Record<ViewId, React.ReactNode> = {
  library: <Library size={15} />,
  queue: <ListOrdered size={15} />,
};

export function TabBar() {
  const activeView = useNavigationStore((s) => s.activeView);
  const setActiveView = useNavigationStore((s) => s.setActiveView);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const setSearchQuery = useLibraryStore((s) => s.setSearchQuery);
  const addMediaToLibrary = useLibraryStore((s) => s.addMediaToLibrary);
  const addMediaToQueue = useLibraryStore((s) => s.addMediaToQueue);

  const handleAdd = async () => {
    const items = await LibraryImportService.pickAndImport();
    if (items.length === 0) return;

    if (activeView === "library") {
      await addMediaToLibrary(items);
    } else {
      await addMediaToQueue(items);
    }
  };

  return (
    <header className={styles.tabBar}>
      <nav className={styles.tabs} aria-label="Main navigation" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => setActiveView(tab.id)}
            >
              <span className={styles.tabIcon}>{tabIcons[tab.id]}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <AddMediaButton onAdd={handleAdd} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </header>
  );
}
