import { useToastStore, type ToastType } from "../store/toast.store";

function push(message: string, type: ToastType): void {
  useToastStore.getState().push(message, type);
}

export const toastService = {
  info: (message: string) => push(message, "info"),
  success: (message: string) => push(message, "success"),
  error: (message: string) => push(message, "error"),
};
