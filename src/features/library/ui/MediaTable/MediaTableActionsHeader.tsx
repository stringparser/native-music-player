import { AddMediaButton } from "../../../../shared/ui/AddMediaButton/AddMediaButton";
import { ToolbarButton } from "../../../../shared";
import tableStyles from "../../../../shared/ui/DataTable/DataTable.module.css";

interface MediaTableActionsHeaderProps {
  onAdd: () => void;
  isImporting: boolean;
  onClearAll?: () => void;
  clearDisabled?: boolean;
}

export function MediaTableActionsHeader({
  onAdd,
  isImporting,
  onClearAll,
  clearDisabled = false,
}: MediaTableActionsHeaderProps) {
  return (
    <>
      {onClearAll ? (
        <ToolbarButton
          label="Clear All"
          variant="danger"
          disabled={clearDisabled}
          onClick={onClearAll}
        />
      ) : (
        <span className={tableStyles.actionsHeaderPlaceholder} aria-hidden="true">
          <ToolbarButton label="Clear All" variant="danger" disabled />
        </span>
      )}
      <AddMediaButton onAdd={onAdd} loading={isImporting} disabled={isImporting} />
    </>
  );
}
