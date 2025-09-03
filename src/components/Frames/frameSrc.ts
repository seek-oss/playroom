import frameConfig from '__PLAYROOM_ALIAS__FRAME_COMPONENT__';

import playroomConfig from '../../config';

interface FrameParams {
  code: string;
  themeName: string;
}

type FrameSrcHandler = (frameParams: FrameParams) => string;

const defaultFrameSrc: FrameSrcHandler = ({ code, themeName }) =>
  `${playroomConfig.baseUrl}frame.html#?themeName=${encodeURIComponent(
    themeName
  )}&code=${encodeURIComponent(code)}`;

export default (frameConfig.frameSrc
  ? frameConfig.frameSrc
  : defaultFrameSrc) as FrameSrcHandler;
