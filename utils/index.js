const lzString = require('lz-string');

const compressParams = ({
  code,
  themes,
  widths,
  theme,
  title,
  editorHidden,
}) => {
  const data = JSON.stringify({
    ...(code ? { code } : {}),
    ...(themes ? { themes } : {}),
    ...(widths ? { widths } : {}),
    ...(theme ? { theme } : {}),
    ...(title ? { title } : {}),
    ...(editorHidden ? { editorHidden } : {}),
  });

  return lzString.compressToEncodedURIComponent(data);
};

const createUrl = ({
  baseUrl,
  code,
  themes,
  widths,
  title,
  editorHidden,
  paramType = 'hash',
}) => {
  let path = '';

  if (code || themes || widths || title || editorHidden) {
    const compressedData = compressParams({
      code,
      themes,
      widths,
      title,
      editorHidden,
    });

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
  editorHidden,
  paramType = 'hash',
}) => {
  let path = '';

  if (code || theme || title || editorHidden) {
    const compressedData = compressParams({ code, theme, title, editorHidden });

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
