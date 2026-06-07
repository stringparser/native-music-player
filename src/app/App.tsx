import { useEffect } from "react";
import { AppLayout } from "./layout/AppLayout";
import { storageService } from "../features/library/services/storage.service";
import { playbackService } from "../features/playback/services/playback.service";

export function App() {
  useEffect(() => {
    void playbackService.init();
    void storageService.hydrate();
  }, []);

  return <AppLayout />;
}
