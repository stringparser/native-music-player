import { create } from "zustand";

interface StatusState {
  isLoading: boolean;
  loadingMessage: string | null;
  isImporting: boolean;
  setLoading: (isLoading: boolean, message?: string | null) => void;
  setImporting: (isImporting: boolean) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  isLoading: false,
  loadingMessage: null,
  isImporting: false,

  setLoading: (isLoading, message = null) =>
    set({ isLoading, loadingMessage: message }),

  setImporting: (isImporting) => set({ isImporting }),
}));
