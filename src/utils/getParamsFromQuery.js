import queryString from 'query-string';

export default () => {
  try {
    const hash = window.location.hash.replace(/^#/, '');
    return queryString.parse(hash);
  } catch (err) {
    return {};
  }
};
