import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );
}
