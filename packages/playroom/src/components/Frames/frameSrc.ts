import frameConfig from '__PLAYROOM_ALIAS__FRAME_COMPONENT__';

import playroomConfig from '../../config';
import type { FrameSettingsValues } from '../../index';

interface FrameParams {
  code: string;
  themeName: string;
  frameSettings?: FrameSettingsValues;
}

type FrameSrcHandler = (frameParams: FrameParams) => string;

const defaultFrameSrc: FrameSrcHandler = ({
  code,
  themeName,
  frameSettings,
}) => {
  const params = new URLSearchParams({
    themeName,
    code,
  });

  if (frameSettings && Object.keys(frameSettings).length > 0) {
    params.set('frameSettings', JSON.stringify(frameSettings));
  }

  return `${playroomConfig.baseUrl}frame.html#?${params.toString()}`;
};

export default (frameConfig.frameSrc
  ? frameConfig.frameSrc
  : defaultFrameSrc) as FrameSrcHandler;
