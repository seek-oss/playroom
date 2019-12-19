interface PlayroomConfig {
  components: string;
  outputPath: string;
  title?: string;
  themes?: string;
  widths?: number[];
  frameComponent?: string;
  exampleCode?: string;
  cwd?: string;
  storageKey?: string;
  webpackConfig?: () => void;
}

interface InternalPlayroomConfig extends PlayroomConfig {
  cwd: string;
  storageKey: string;
  port: number;
  openBrowser: boolean;
}

interface Window {
  __playroomConfig__: InternalPlayroomConfig;
}

declare const __PLAYROOM_GLOBAL__CONFIG__: InternalPlayroomConfig;
