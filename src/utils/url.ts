import lzString from 'lz-string';

export type ParamType = 'hash' | 'search';

export interface CompressParamsOptions {
  code?: string;
  themes?: string[];
  widths?: number[];
  theme?: string;
}

export const compressParams = ({
  code,
  themes,
  widths,
  theme,
}: CompressParamsOptions): string => {
  const data = JSON.stringify({
    ...(code ? { code } : {}),
    ...(themes ? { themes } : {}),
    ...(widths ? { widths } : {}),
    ...(theme ? { theme } : {}),
  });

  return lzString.compressToEncodedURIComponent(data);
};

export interface CreateUrlOptions {
  baseUrl?: string;
  code?: string;
  themes?: string[];
  widths?: number[];
  paramType?: ParamType;
}

export const createUrl = ({
  baseUrl,
  code,
  themes,
  widths,
  paramType = 'hash',
}: CreateUrlOptions): string => {
  let path = '';

  if (code || themes || widths) {
    const compressedData = compressParams({ code, themes, widths });

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
}

export const createPreviewUrl = ({
  baseUrl,
  code,
  theme,
  paramType = 'hash',
}: CreatePreviewUrlOptions): string => {
  let path = '';

  if (code || theme) {
    const compressedData = compressParams({ code, theme });

    path = `/preview/${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}${path}`;
  }

  return path;
};
