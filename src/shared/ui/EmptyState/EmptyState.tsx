import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {description && <span className={styles.description}>{description}</span>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
