import { useContext } from 'react';

import playroomConfig from '../config';
import { themesEnabled } from '../configModules/themes';
import { StoreContext } from '../contexts/StoreContext';
import { createPreviewUrl } from '../index';

import { useEditorUrl } from './useEditorUrl';

export default (theme?: string) => {
  const [{ code, title, editorHidden }] = useContext(StoreContext);
  const baseUrl = useEditorUrl();

  return createPreviewUrl({
    baseUrl,
    code,
    theme: themesEnabled ? theme : undefined,
    paramType: playroomConfig.paramType,
    title,
    editorHidden,
  });
};
