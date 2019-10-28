import React from 'react';
import { render } from 'react-dom';
import localforage from 'localforage';
import queryString from 'query-string';
import base64url from 'base64-url';
import lzString from 'lz-string';
import dedent from 'dedent';
import Playroom from './Playroom/Playroom';

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);
const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

const widths = playroomConfig.widths || [320, 375, 768, 1024];

const outlet = document.createElement('div');
document.body.appendChild(outlet);

export const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1
});

const getCode = () => {
  const hash = window.location.hash.replace(/^#/, '');
  const query = queryString.parse(hash);
  const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

  if (query.source) {
    return Promise.resolve(
      lzString.decompressFromEncodedURIComponent(query.source)
    );
  }

  if (query.code) {
    // backward compatibility
    return Promise.resolve(base64url.decode(query.code));
  }

  return store.getItem('code').then(code => code || exampleCode);
};

const updateCode = code => {
  const compressedCode = code
    ? lzString.compressToEncodedURIComponent(code)
    : '';

  history.replaceState(null, null, `#?source=${compressedCode}`);
  store.setItem('code', code);
};

render(
  <Playroom
    staticTypes={staticTypes}
    widths={widths}
    defaultFrames={playroomConfig.defaultFrames}
    getCode={getCode}
    updateCode={updateCode}
  />,
  outlet
);
