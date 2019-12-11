interface PlayroomConfig {
  components: string;
  outputPath: string;
  title?: string;
  themes?: string;
  frameComponent?: string;
  widths?: number[];
  port?: number;
  openBrowser?: boolean;
  exampleCode?: string;
  storageKey?: string;
  webpackConfig?: () => void;
}

interface Window {
  __playroomConfig__: PlayroomConfig;
}

declare const __PLAYROOM_GLOBAL__CONFIG__: PlayroomConfig;
declare const __PLAYROOM_GLOBAL__STATIC_TYPES__: any;
