import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { ToolbarButton } from "../../../../shared";
import styles from "./MediaTabToolbar.module.css";

interface MediaTabToolbarProps {
  primaryLabel: string;
  secondaryLabel?: string;
  onImport: () => void;
  isImporting: boolean;
  onClearAll?: () => void;
  clearDisabled?: boolean;
}

export function MediaTabToolbar({
  primaryLabel,
  secondaryLabel,
  onImport,
  isImporting,
  onClearAll,
  clearDisabled = false,
}: MediaTabToolbarProps) {
  return (
    <div className={styles.toolbar} data-media-tab-toolbar>
      <div className={styles.summary}>
        <span className={styles.summaryPrimary}>{primaryLabel}</span>
        {secondaryLabel && (
          <span className={styles.summarySecondary}>{secondaryLabel}</span>
        )}
      </div>
      <div className={styles.actions}>
        {onClearAll ? (
          <ToolbarButton
            label="Clear All"
            variant="danger"
            disabled={clearDisabled}
            onClick={onClearAll}
          />
        ) : (
          <span className={styles.actionsPlaceholder} aria-hidden="true">
            <ToolbarButton label="Clear All" variant="danger" disabled />
          </span>
        )}
        <AddMediaButton onAdd={onImport} loading={isImporting} disabled={isImporting} />
      </div>
    </div>
  );
}
