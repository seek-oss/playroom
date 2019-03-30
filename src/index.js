import React from 'react';
import { render } from 'react-dom';
import localforage from 'localforage';
import queryString from 'query-string';
import base64url from 'base64-url';
import dedent from 'dedent';
import Playroom from './Playroom/Playroom';

const playroomConfig = __PLAYROOM_GLOBAL__CONFIG__;
const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

const widths = playroomConfig.widths || [320, 375, 768, 1024];

const outlet = document.createElement('div');
document.body.appendChild(outlet);

export const store = localforage.createInstance({
  name: 'playroom',
  version: 1
});

const getCode = () => {
  const hash = window.location.hash.replace(/^#/, '');
  const query = queryString.parse(hash);
  const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

  return query.code
    ? Promise.resolve(query.code ? base64url.decode(query.code) : exampleCode)
    : store.getItem('code').then(code => code || exampleCode);
};

const updateCode = code => {
  history.replaceState(
    null,
    null,
    `#?code=${code ? base64url.encode(code) : ''}`
  );
  store.setItem('code', code);
};

render(
  <Playroom
    staticTypes={staticTypes}
    widths={widths}
    defaultFrames={playroomConfig.defaultFrames}
    getCode={getCode}
    updateCode={updateCode}
    snippets={playroomConfig.snippets}
  />,
  outlet
);
