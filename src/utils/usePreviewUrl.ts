import { useContext } from 'react';

import { createPreviewUrl } from '../../utils';
import playroomConfig from '../config';
import { themesEnabled } from '../configModules/themes';
import { StoreContext } from '../contexts/StoreContext';

const baseUrl = window.location.href
  .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
  .split('index.html')[0];

export default (theme?: string) => {
  const [{ code, title, editorHidden }] = useContext(StoreContext);

  return createPreviewUrl({
    baseUrl,
    code,
    theme: themesEnabled ? theme : undefined,
    paramType: playroomConfig.paramType,
    title,
    editorHidden,
  });
};
