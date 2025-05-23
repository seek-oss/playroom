import { useContext } from 'react';

import { createPreviewUrl } from '../../utils';
import { StoreContext } from '../StoreContext/StoreContext';
import playroomConfig from '../config';

const baseUrl = window.location.href
  .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
  .split('index.html')[0];

export default (theme: string) => {
  const [{ code, title, editorHidden }] = useContext(StoreContext);

  const isThemed = theme !== '__PLAYROOM__NO_THEME__';

  return createPreviewUrl({
    baseUrl,
    code,
    theme: isThemed ? theme : undefined,
    paramType: playroomConfig.paramType,
    title,
    editorHidden,
  });
};
