// eslint-disable-next-line import-x/no-unresolved
const frameConfig = require('__PLAYROOM_ALIAS__FRAME_COMPONENT__');

const defaultFrameSrc = ({ code, themeName }, { baseUrl }) =>
  `${baseUrl}frame.html#?themeName=${encodeURIComponent(
    themeName
  )}&code=${encodeURIComponent(code)}`;

module.exports = frameConfig.frameSrc ? frameConfig.frameSrc : defaultFrameSrc;
