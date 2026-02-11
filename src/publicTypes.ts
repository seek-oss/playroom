interface Snippet {
  group?: string;
  name: string;
  description?: string;
  code: string;
}

export interface PlayroomConfig {
  components: string;
  outputPath: string;
  title?: string;
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
