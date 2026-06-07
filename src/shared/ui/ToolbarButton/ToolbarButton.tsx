import styles from "./ToolbarButton.module.css";

interface ToolbarButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

export function ToolbarButton({
  label,
  icon,
  onClick,
  variant = "default",
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.toolbarBtn} ${variant === "danger" ? styles.danger : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
