const lzString = require('lz-string');

const createUrl = ({ baseUrl, code }) => {
  const compressedCode = code
    ? lzString.compressToEncodedURIComponent(code)
    : '';

  const path = `#?source=${compressedCode}`;

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

module.exports = {
  createUrl
};
