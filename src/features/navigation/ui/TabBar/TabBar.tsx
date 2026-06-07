import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { tabs } from "../../model/navigation.config";
import { useNavigationStore } from "../../store/navigation.store";
import { useLibraryStore } from "../../../library/store/library.store";
import styles from "./TabBar.module.css";

export function TabBar() {
  const activeView = useNavigationStore((s) => s.activeView);
  const setActiveView = useNavigationStore((s) => s.setActiveView);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const queueLength = useLibraryStore((s) => s.queue.length);
  const setSearchQuery = useLibraryStore((s) => s.setSearchQuery);

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
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </header>
  );
}
