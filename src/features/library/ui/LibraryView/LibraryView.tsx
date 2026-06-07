import { useNavigationStore } from "../../../navigation/store/navigation.store";
import { LibraryTab } from "../LibraryTab/LibraryTab";
import { QueueTab } from "../QueueTab/QueueTab";
import styles from "./LibraryView.module.css";

export function LibraryView() {
  const activeView = useNavigationStore((s) => s.activeView);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        {activeView === "queue" ? <QueueTab /> : <LibraryTab />}
      </div>
    </main>
  );
}
