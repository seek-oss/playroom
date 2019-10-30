const lzString = require('lz-string');

const createUrl = ({ baseUrl, code }) => {
  const data = JSON.stringify({ code });

  const compressedData = lzString.compressToEncodedURIComponent(data);

  const path = `#?code=${compressedData}`;

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

module.exports = {
  createUrl
};
