import styles from "./SectionToolbar.module.css";

interface SectionToolbarProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
}

export function SectionToolbar({ title, count, children }: SectionToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.titleGroup}>
        <span className={styles.title}>{title}</span>
        {count !== undefined && <span className={styles.count}>{count}</span>}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
