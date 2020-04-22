import { useContext } from 'react';

import { StoreContext } from './../StoreContext/StoreContext';
import { createPrototypeUrl } from '../../utils';

const baseUrl = `${window.location.protocol}//${window.location.host}`;

export default (theme: string) => {
  const [{ code }] = useContext(StoreContext);

  const isThemed = theme !== '__PLAYROOM__NO_THEME__';

  return createPrototypeUrl({
    baseUrl,
    code,
    theme: isThemed ? theme : undefined
  });
};
