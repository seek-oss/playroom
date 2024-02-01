import type { ParserOptions } from 'react-docgen-typescript';
import type { ParamType } from '../utils/index';

// all of the types in here get exposed as part of the public API

export interface Snippet {
  group: string;
  name: string;
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
  bundler: 'webpack' | 'vite';
  viteConfig?: () => Promise<any>;
  webpackConfig?: () => Promise<any>;
  baseUrl?: string;
  paramType: ParamType;
  iframeSandbox?: string;
  reactDocgenTypescriptConfig?: ParserOptions;
}
