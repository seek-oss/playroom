// eslint-disable-next-line @typescript-eslint/no-var-requires
const frameConfig = require('__PLAYROOM_ALIAS__FRAME_COMPONENT__');

interface FrameParams {
  code: string;
  themeName: string;
}
const defaultFrameSrc = (
  { code, themeName }: FrameParams,
  { baseUrl, paramType }: InternalPlayroomConfig
) =>
  `${baseUrl}frame.html${
    paramType === 'hash' ? '#' : ''
  }?themeName=${encodeURIComponent(themeName)}&code=${encodeURIComponent(
    code
  )}`;

module.exports = frameConfig.frameSrc ? frameConfig.frameSrc : defaultFrameSrc;
