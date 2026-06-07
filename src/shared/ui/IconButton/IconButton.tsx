import styles from "./IconButton.module.css";

interface IconButtonProps {
  title: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  children: React.ReactNode;
}

export function IconButton({
  title,
  onClick,
  variant = "default",
  disabled = false,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.iconBtn} ${variant === "danger" ? styles.danger : ""}`}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
