import { useStatusStore } from "../../store/status.store";
import styles from "./LoadingOverlay.module.css";

export function LoadingOverlay() {
  const isLoading = useStatusStore((state) => state.isLoading);
  const loadingMessage = useStatusStore((state) => state.loadingMessage);

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.spinner} aria-hidden />
        <span>{loadingMessage ?? "Loading…"}</span>
      </div>
    </div>
  );
}
