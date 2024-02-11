const lzString = require('lz-string');

const compressParams = ({ code, themes, widths, theme, title }) => {
  const data = JSON.stringify({
    ...(code ? { code } : {}),
    ...(themes ? { themes } : {}),
    ...(widths ? { widths } : {}),
    ...(theme ? { theme } : {}),
    ...(title ? { title } : {}),
  });

  return lzString.compressToEncodedURIComponent(data);
};

const createUrl = ({
  baseUrl,
  code,
  themes,
  widths,
  title,
  paramType = 'hash',
}) => {
  let path = '';

  if (code || themes || widths || title) {
    const compressedData = compressParams({ code, themes, widths, title });

    path = `${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

const createPreviewUrl = ({
  baseUrl,
  code,
  theme,
  title,
  paramType = 'hash',
}) => {
  let path = '';

  if (code || theme || title) {
    const compressedData = compressParams({ code, theme, title });

    path = `/preview/${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}${path}`;
  }

  return path;
};

module.exports = {
  compressParams,
  createUrl,
  createPreviewUrl,
};
