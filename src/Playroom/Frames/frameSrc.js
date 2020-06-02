// eslint-disable-next-line import/no-unresolved
const frameConfig = require('__PLAYROOM_ALIAS__FRAME_COMPONENT__');

const defaultFrameSrc = ({ code, themeName }, { baseUrl, paramType }) =>
  `${baseUrl}frame.html${
    paramType === 'hash' ? '#' : ''
  }?themeName=${encodeURIComponent(themeName)}&code=${encodeURIComponent(
    code
  )}`;

module.exports = frameConfig.frameSrc ? frameConfig.frameSrc : defaultFrameSrc;
