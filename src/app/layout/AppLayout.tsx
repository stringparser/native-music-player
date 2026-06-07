import { LibraryView } from "../../features/library";
import { TabBar } from "../../features/navigation";
import { PlayerBar } from "../../features/playback";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <TabBar />
      <div className={styles.workspace}>
        <LibraryView />
      </div>
      <PlayerBar />
    </div>
  );
}
