import playroomConfig from '../config';

export const useEditorUrl = () =>
  window.location.href
    .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
    .split('index.html')[0];
