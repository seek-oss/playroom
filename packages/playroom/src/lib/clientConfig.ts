import type { ResolvedPlayroomConfig } from './provideDefaultConfig.ts';

export type ClientConfig = Pick<
  ResolvedPlayroomConfig,
  | 'title'
  | 'baseUrl'
  | 'paramType'
  | 'storageKey'
  | 'widths'
  | 'exampleCode'
  | 'frameSettings'
  | 'iframeSandbox'
  | 'defaultVisibleThemes'
  | 'defaultVisibleWidths'
  | 'defaultEditorPosition'
>;

export const toClientConfig = ({
  title,
  baseUrl,
  paramType,
  storageKey,
  widths,
  exampleCode,
  frameSettings,
  iframeSandbox,
  defaultVisibleThemes,
  defaultVisibleWidths,
  defaultEditorPosition,
}: ResolvedPlayroomConfig): ClientConfig => ({
  title,
  baseUrl,
  paramType,
  storageKey,
  widths,
  exampleCode,
  frameSettings,
  iframeSandbox,
  defaultVisibleThemes,
  defaultVisibleWidths,
  defaultEditorPosition,
});
