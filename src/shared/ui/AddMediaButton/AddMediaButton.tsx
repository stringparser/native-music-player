import { Plus } from "lucide-react";
import styles from "./AddMediaButton.module.css";

interface AddMediaButtonProps {
  onAdd: () => void;
}

export function AddMediaButton({ onAdd }: AddMediaButtonProps) {
  return (
    <button type="button" className={styles.addBtn} onClick={onAdd}>
      <Plus size={16} />
      Add
    </button>
  );
}
