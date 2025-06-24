import frameConfig from '__PLAYROOM_ALIAS__FRAME_COMPONENT__';

import type { PlayroomConfig } from '../../publicTypes';

interface FrameParams {
  code: string;
  themeName: string;
}

type FrameSrcHandler = (
  frameParams: FrameParams,
  config: PlayroomConfig
) => string;

const defaultFrameSrc: FrameSrcHandler = ({ code, themeName }, { baseUrl }) =>
  `${baseUrl}frame.html#?themeName=${encodeURIComponent(
    themeName
  )}&code=${encodeURIComponent(code)}`;

export default (frameConfig.frameSrc
  ? frameConfig.frameSrc
  : defaultFrameSrc) as FrameSrcHandler;
