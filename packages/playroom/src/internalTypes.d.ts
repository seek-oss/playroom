import type { ClientConfig } from './lib/clientConfig';

declare global {
  const __PLAYROOM_GLOBAL__CONFIG__: ClientConfig;
  const __PLAYROOM_GLOBAL__STATIC_TYPES__: Record<
    string,
    Record<string, string[]>
  >;

  interface Window {
    __playroomConfig__: ClientConfig;
  }
}
