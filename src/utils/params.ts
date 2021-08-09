import { createBrowserHistory } from 'history';
import { useState, useEffect } from 'react';
import queryString, { ParsedQuery } from 'query-string';

import playroomConfig from '../config';

const history = createBrowserHistory();

export function updateUrlCode(code: string) {
  const { pathname } = history.location;

  const existingQuery = getParamsFromQuery();

  const newQuery = queryString.stringify({
    ...existingQuery,
    code,
  });

  const params =
    playroomConfig.paramType === 'hash' ? `#?${newQuery}` : `?${newQuery}`;

  history.replace(`${pathname}${params}`);
}

export function getParamsFromQuery(location = history.location) {
  try {
    return queryString.parse(
      playroomConfig.paramType === 'hash'
        ? location.hash.replace(/^#/, '')
        : location.search
    );
  } catch (err) {
    return {};
  }
}

export function useParams<ReturnType>(
  selector: (rawParams: ParsedQuery) => ReturnType
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
