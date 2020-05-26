const lzString = require('lz-string');

const createUrl = ({ baseUrl, code, themes, widths, paramType = 'hash' }) => {
  let path = '';

  if (code || themes || widths) {
    const data = JSON.stringify({
      ...(code ? { code } : {}),
      ...(themes ? { themes } : {}),
      ...(widths ? { widths } : {}),
    });

    const compressedData = lzString.compressToEncodedURIComponent(data);
    path = `${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

const createPreviewUrl = ({ baseUrl, code, theme, paramType = 'hash' }) => {
  let path = '';

  if (code || theme) {
    const data = JSON.stringify({
      ...(code ? { code } : {}),
      ...(theme ? { theme } : {}),
    });

    const compressedData = lzString.compressToEncodedURIComponent(data);
    path = `/preview${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}${path}`;
  }

  return path;
};

module.exports = {
  createUrl,
  createPreviewUrl,
};
