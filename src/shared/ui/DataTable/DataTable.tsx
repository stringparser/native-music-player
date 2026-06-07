import styles from "./DataTable.module.css";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  className?: string;
  cell: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  items: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  selectedId?: string | null;
  nowPlayingId?: string | null;
  onSelect?: (item: T) => void;
  onDoubleClick?: (item: T) => void;
  renderRowActions?: (item: T) => React.ReactNode;
  renderActionsHeader?: () => React.ReactNode;
}

export function DataTable<T>({
  items,
  columns,
  getRowKey,
  selectedId,
  nowPlayingId,
  onSelect,
  onDoubleClick,
  renderRowActions,
  renderActionsHeader,
}: DataTableProps<T>) {
  const hasActions = Boolean(renderRowActions || renderActionsHeader);

  const rowClassName = (item: T) => {
    const key = getRowKey(item);
    const classes = [];
    if (selectedId === key) classes.push(styles.selected);
    if (nowPlayingId === key) classes.push(styles.nowPlaying);
    return classes.join(" ");
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id} className={column.className}>
              {column.header}
            </th>
          ))}
          {hasActions && (
            <th className={`${styles.colActions} ${styles.colActionsHeader}`}>
              {renderActionsHeader?.()}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={getRowKey(item)}
            className={rowClassName(item)}
            onClick={() => onSelect?.(item)}
            onDoubleClick={() => onDoubleClick?.(item)}
          >
            {columns.map((column) => (
              <td key={column.id} className={column.className}>
                {column.cell(item)}
              </td>
            ))}
            {hasActions && (
              <td className={styles.colActions}>
                <div
                  className={styles.rowActions}
                  onClick={(event) => event.stopPropagation()}
                  onDoubleClick={(event) => event.stopPropagation()}
                >
                  {renderRowActions?.(item)}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
