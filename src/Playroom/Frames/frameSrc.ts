// eslint-disable-next-line import/no-unresolved
// const frameConfig = require('__PLAYROOM_ALIAS__FRAME_COMPONENT__');

interface FrameParams {
  code: string;
  themeName: string;
}

const frameSrc = (
  { code, themeName }: FrameParams,
  { baseUrl, paramType }: InternalPlayroomConfig
) =>
  `${baseUrl}frame.html${
    paramType === 'hash' ? '#' : ''
  }?themeName=${encodeURIComponent(themeName)}&code=${encodeURIComponent(
    code
  )}`;

// const frameSrc = frameConfig.frameSrc ? frameConfig.frameSrc : defaultFrameSrc;

export default frameSrc;
