interface PlayroomConfig {
  components: string;
  outputPath: string;
  title?: string;
  editorHidden?: boolean;
  themes?: string;
  widths?: number[];
  snippets?: Snippet[];
  frameComponent?: string;
  exampleCode?: string;
  cwd?: string;
  storageKey?: string;
  webpackConfig?: () => void;
  baseUrl?: string;
  paramType: 'hash' | 'search';
  iframeSandbox?: string;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  reactDocgenTypescriptConfig?: import('react-docgen-typescript').ParserOptions;
  defaultVisibleThemes?: string[];
  defaultVisibleWidths?: number[];
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
declare const __PLAYROOM_GLOBAL__STATIC_TYPES__: Record<
  string,
  Record<string, unknown>
>;
