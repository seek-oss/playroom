import { compressToEncodedURIComponent } from 'lz-string';

export const compressParams = ({ code, themes, widths, theme }) => {
  const data = JSON.stringify({
    ...(code ? { code } : {}),
    ...(themes ? { themes } : {}),
    ...(widths ? { widths } : {}),
    ...(theme ? { theme } : {}),
  });

  return compressToEncodedURIComponent(data);
};

// export const createUrl = ({
//   baseUrl,
//   code,
//   themes,
//   widths,
//   paramType = 'hash',
// }) => {
//   let path = '';
//
//   if (code || themes || widths) {
//     const compressedData = compressParams({ code, themes, widths });
//
//     path = `${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
//   }
//
//   if (baseUrl) {
//     const trimmedBaseUrl = baseUrl.replace(/\/$/, '');
//
//     return `${trimmedBaseUrl}/${path}`;
//   }
//
//   return path;
// };
//
export const createPreviewUrl = ({
  baseUrl,
  code,
  theme,
  paramType = 'hash',
}) => {
  let path = '';

  if (code || theme) {
    const compressedData = compressParams({ code, theme });

    path = `/preview/${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}${path}`;
  }

  return path;
};
