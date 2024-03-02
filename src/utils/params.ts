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
    return new URLSearchParams(
      playroomConfig.paramType === 'hash'
        ? location.hash.replace(/^#/, '')
        : location.search
    );
  } catch (err) {
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
