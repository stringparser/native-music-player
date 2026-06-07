import { toastService } from "../../../shared/services/toast.service";
import { useStatusStore } from "../../../shared/store/status.store";
import { LibraryImportService } from "../services/library-import.service";
import { useLibraryStore } from "../store/library.store";

type ImportTarget = "library" | "queue";

export function useMediaImport(target: ImportTarget) {
  const addMediaToLibrary = useLibraryStore((s) => s.addMediaToLibrary);
  const addMediaToQueue = useLibraryStore((s) => s.addMediaToQueue);
  const isImporting = useStatusStore((s) => s.isImporting);
  const setImporting = useStatusStore((s) => s.setImporting);

  const importMedia = async () => {
    setImporting(true);
    try {
      const items = await LibraryImportService.pickAndImport();
      if (items.length === 0) return;

      if (target === "library") {
        await addMediaToLibrary(items);
      } else {
        await addMediaToQueue(items);
      }
    } catch {
      toastService.error("Failed to import folders");
    } finally {
      setImporting(false);
    }
  };

  return { importMedia, isImporting };
}
