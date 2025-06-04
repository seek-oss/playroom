import type { PlayroomConfig } from './publicTypes';

interface InternalPlayroomConfig extends PlayroomConfig {
  cwd: string;
  storageKey: string;
  port: number;
  openBrowser: boolean;
}

declare global {
  const __PLAYROOM_GLOBAL__CONFIG__: InternalPlayroomConfig;
  const __PLAYROOM_GLOBAL__STATIC_TYPES__: Record<
    string,
    Record<string, string[]>
  >;

  interface Window {
    __playroomConfig__: InternalPlayroomConfig;
  }
}
