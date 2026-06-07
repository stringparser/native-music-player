import { create } from "zustand";

export type ToastType = "info" | "success" | "error";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
}

const TOAST_DURATION_MS = 4000;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: (message, type = "info") => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    window.setTimeout(() => {
      get().dismiss(id);
    }, TOAST_DURATION_MS);
  },

  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
