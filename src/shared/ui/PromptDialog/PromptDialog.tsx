import { useEffect, useRef, useState } from "react";
import styles from "./PromptDialog.module.css";

interface PromptDialogProps {
  open: boolean;
  title: string;
  label: string;
  defaultValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({
  open,
  title,
  label,
  defaultValue = "",
  confirmLabel = "Create",
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      window.setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [open, defaultValue]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onConfirm(value);
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <form
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>
          <label className={styles.label} htmlFor="prompt-input">
            {label}
          </label>
          <input
            ref={inputRef}
            id="prompt-input"
            className={styles.input}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.confirmBtn}
            disabled={!value.trim()}
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
