import { Loader2 } from "lucide-react";
import styles from "./AddMediaButton.module.css";

interface AddMediaButtonProps {
  onAdd: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AddMediaButton({
  onAdd,
  disabled = false,
  loading = false,
}: AddMediaButtonProps) {
  return (
    <button
      type="button"
      className={styles.addBtn}
      onClick={onAdd}
      disabled={disabled || loading}
    >
      {loading && <Loader2 size={16} className={styles.spinner} />}
      {loading ? "Importing…" : "Add"}
    </button>
  );
}
