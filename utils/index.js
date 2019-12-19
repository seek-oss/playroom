const lzString = require('lz-string');

const createUrl = ({ baseUrl, code, themes, widths }) => {
  let path = '';

  if (code || themes || widths) {
    const data = JSON.stringify({
      ...(code ? { code } : {}),
      ...(themes ? { themes } : {}),
      ...(widths ? { widths } : {})
    });

    const compressedData = lzString.compressToEncodedURIComponent(data);
    path = `#?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

module.exports = {
  createUrl
};
