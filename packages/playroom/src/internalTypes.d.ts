import type { PlayroomConfig } from '../utils';

type InternalPlayroomConfig = PlayroomConfig &
  Required<
    Pick<
      PlayroomConfig,
      'cwd' | 'storageKey' | 'port' | 'openBrowser' | 'paramType'
    >
  >;

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
