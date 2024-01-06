// file with types that are not meant to be exposed as part of the public API

import type { PlayroomConfig } from './types';

export interface InternalPlayroomConfig extends PlayroomConfig {
  cwd: string;
  storageKey: string;
  port: number;
  openBrowser: boolean;
}

declare global {
  declare const __PLAYROOM_GLOBAL__CONFIG__: InternalPlayroomConfig;
  declare const __PLAYROOM_GLOBAL__STATIC_TYPES__: any;

  interface Window {
    __playroomConfig__: InternalPlayroomConfig;
  }
}

export interface InternalPlayroomConfig extends PlayroomConfig {
  cwd: string;
  storageKey: string;
  port: number;
  openBrowser: boolean;
}

export interface FrameParams {
  code: string;
  themeName: string;
}

export type FrameSrcHandler = (
  frameParams: FrameParams,
  config: InternalPlayroomConfig
) => string;
