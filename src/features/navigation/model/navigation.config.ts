import type { TabItem } from "./types";

export const tabs: TabItem[] = [
  { id: "library", label: "Library" },
  { id: "queue", label: "Queue" },
];

export const viewTitles: Record<string, string> = {
  library: "Library",
  queue: "Queue",
};
