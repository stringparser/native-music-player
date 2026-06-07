import { create } from "zustand";
import type { ViewId } from "../model/types";

interface NavigationState {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: "library",
  setActiveView: (view) => set({ activeView: view }),
}));
