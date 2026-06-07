import { useToastStore } from "../../store/toast.store";
import styles from "./ToastContainer.module.css";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
