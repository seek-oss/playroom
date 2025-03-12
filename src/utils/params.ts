import { createBrowserHistory } from 'history';
import { useState, useEffect } from 'react';

import playroomConfig from '../config';

const history = createBrowserHistory();

export function updateUrlCode(code: string) {
  const { pathname } = history.location;

  const existingQuery = getParamsFromQuery();

  const newQuery = new URLSearchParams(existingQuery);
  newQuery.set('code', code);

  const params =
    playroomConfig.paramType === 'hash' ? `#?${newQuery}` : `?${newQuery}`;

  history.replace(`${pathname}${params}`);
}

export function getParamsFromQuery(location = history.location) {
  try {
    // Prefer checking `hash`, fall back to `search` in case the user has configured a custom
    // `frameSrc` function that sets search params instead of the hash
    const isParamsInHash = location.hash.startsWith('#?');

    if (isParamsInHash) {
      return new URLSearchParams(location.hash.slice(1));
    }

    return new URLSearchParams(location.search);
  } catch {
    return new URLSearchParams();
  }
}

export function useParams<ReturnType>(
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
