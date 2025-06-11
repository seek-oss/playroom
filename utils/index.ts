import { compressToEncodedURIComponent } from 'lz-string';

import type { Widths } from '../src/Playroom/Playroom';

export interface Snippet {
  group: string;
  name: string;
  code: string;
}

export type Snippets = Snippet[];

export interface CompressParamsOptions {
  code?: string;
  themes?: string[];
  widths?: Widths;
  theme?: string;
  title?: string;
  editorHidden?: boolean;
}

export const compressParams = ({
  code,
  themes,
  widths,
  theme,
  title,
  editorHidden,
}: CompressParamsOptions): string => {
  const data = JSON.stringify({
    ...(code ? { code } : {}),
    ...(themes ? { themes } : {}),
    ...(widths ? { widths } : {}),
    ...(theme ? { theme } : {}),
    ...(title ? { title } : {}),
    ...(editorHidden ? { editorHidden } : {}),
  });

  return compressToEncodedURIComponent(data);
};

export type ParamType = 'hash' | 'search';

export interface CreateUrlOptions {
  baseUrl?: string;
  code?: string;
  themes?: string[];
  widths?: Widths;
  paramType?: ParamType;
  title?: string;
  editorHidden?: boolean;
}

export const createUrl = ({
  baseUrl,
  code,
  themes,
  widths,
  title,
  editorHidden,
  paramType = 'hash',
}: CreateUrlOptions): string => {
  let path = '';

  if (code || themes || widths || title || editorHidden) {
    const compressedData = compressParams({
      code,
      themes,
      widths,
      title,
      editorHidden,
    });

    path = `${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

export interface CreatePreviewUrlOptions {
  baseUrl?: string;
  code?: string;
  theme?: string;
  paramType?: ParamType;
  title?: string;
  editorHidden?: boolean;
}

export const createPreviewUrl = ({
  baseUrl,
  code,
  theme,
  title,
  editorHidden,
  paramType = 'hash',
}: CreatePreviewUrlOptions): string => {
  let path = '';

  if (code || theme || title || editorHidden) {
    const compressedData = compressParams({ code, theme, title, editorHidden });

    path = `/preview/${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}${path}`;
  }

  return path;
};
