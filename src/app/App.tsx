import { useEffect } from "react";
import { AppLayout } from "./layout/AppLayout";
import { storageService } from "../features/library/services/storage.service";
import { playbackService, usePlaybackShortcuts } from "../features/playback";

export function App() {
  usePlaybackShortcuts();

  useEffect(() => {
    void playbackService.init();
    void storageService.hydrate();
  }, []);

  return <AppLayout />;
}
