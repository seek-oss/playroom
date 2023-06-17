import type { FrameSrcHandler } from '../../types';

import frameConfig from '__PLAYROOM_ALIAS__FRAME_COMPONENT__';

const defaultFrameSrc: FrameSrcHandler = (
  { code, themeName },
  { baseUrl, paramType }
) =>
  `${baseUrl}frame.html${
    paramType === 'hash' ? '#' : ''
  }?themeName=${encodeURIComponent(themeName)}&code=${encodeURIComponent(
    code
  )}`;

export default (frameConfig.frameSrc
  ? frameConfig.frameSrc
  : defaultFrameSrc) as FrameSrcHandler;
