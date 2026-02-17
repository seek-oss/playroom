import { createBrowserHistory } from 'history';
import lzString from 'lz-string';
import { useState, useEffect, type ReactNode } from 'react';

import { decompressParams } from '../../utils';
import playroomConfig from '../config';
import themes from '../configModules/themes';

import { compileJsx } from './compileJsx';

const history = createBrowserHistory();

export function createUrlForData(dataParam: string) {
  const { pathname } = history.location;

  const existingQuery = getParamsFromQuery();

  const newQuery = new URLSearchParams(existingQuery);
  newQuery.set('code', dataParam);

  const newDataParam =
    playroomConfig.paramType === 'hash' ? `#?${newQuery}` : `?${newQuery}`;

  return `${pathname}${newDataParam}`;
}

export function updateUrlCode(code: string) {
  history.replace(createUrlForData(code));
}

function getParamsFromQuery(location = history.location) {
  try {
    // Prefer checking `hash`, fall back to `search` in case the user has configured a custom
    // `frameSrc` function that uses search params instead of the hash
    return new URLSearchParams(
      location.hash.startsWith('#?') ? location.hash.slice(1) : location.search
    );
  } catch {
    return new URLSearchParams();
  }
}

function useParams<ReturnType>(
  selector: (rawParams: URLSearchParams) => ReturnType
): ReturnType {
  const [params, setParams] = useState(getParamsFromQuery);

  useEffect(
    () =>
      history.listen((location) => {
        setParams(getParamsFromQuery(location.location));
      }),
    []
  );

  return selector(params);
}

export const getDataParam = (location = history.location) =>
  getParamsFromQuery(location).get('code');

export const resolveDataFromUrl = (location = history.location) =>
  decompressParams(getDataParam(location));

export const UrlParams = ({
  children,
  decodeUrl,
}: {
  children: (params: {
    themeName: string;
    theme: any;
    code: string;
    title: string;
  }) => ReactNode;
  decodeUrl?: boolean;
}) => {
  const { themeName, code, title } = useParams((rawParams) => {
    const rawThemeName = rawParams.get('themeName');
    const rawCode = rawParams.get('code');

    if (decodeUrl && rawCode) {
      const result = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(rawCode)) ?? ''
      );

      return {
        code: compileJsx(result.code),
        themeName: result.theme,
        title: result.title,
      };
    }

    return {
      themeName: rawThemeName || '',
      code: rawCode || '',
    };
  });

  const resolvedThemeName =
    themeName === '__PLAYROOM__NO_THEME__' ? null : themeName;
  const resolvedTheme = resolvedThemeName ? themes[resolvedThemeName] : null;

  return children({
    themeName,
    code,
    theme: resolvedTheme,
    title,
  });
};
