import type { InternalPlayroomConfig } from '../../types';

import frameConfig from '__PLAYROOM_ALIAS__FRAME_COMPONENT__';

interface FrameParams {
  code: string;
  themeName: string;
}

type FrameSrcHandler = (
  frameParams: FrameParams,
  config: InternalPlayroomConfig
) => string;

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
