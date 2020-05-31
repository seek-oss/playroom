import { createBrowserHistory } from 'history';
import { useState, useEffect } from 'react';
import queryString, { ParsedQuery } from 'query-string';

import playroomConfig from '../config';

const history = createBrowserHistory();

export const replaceUrl = (url: string) => history.replace(url);

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
        setParams(getParamsFromQuery(location));
      }),
    []
  );

  return selector(params);
}
