import { useState, useEffect } from 'react';
import localforage from 'localforage';
import base64url from 'base64-url';
import lzString from 'lz-string';
import dedent from 'dedent';

import { createUrl } from '../../utils';
import getParamsFromQuery from '../utils/getParamsFromQuery';

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);
const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const getKey = position =>
  /^(left|right)$/.test(position) ? 'editorWidth' : 'editorHeight';

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1
});

const defaultPosition = 'bottom';
const defaultSize = 200;

export const useStore = () => {
  const [code, setCode] = useState(exampleCode);
  const [editorPosition, setEditorPosition] = useState(defaultPosition);
  const [editorSize, setEditorSize] = useState(defaultSize);
  const [ready, setReady] = useState(false);

  const setSize = (size, position) => {
    setEditorSize(size);

    store.setItem(getKey(position), size);
  };

  const setPosition = (position = defaultPosition) => {
    setEditorPosition(position);

    store.getItem(getKey(position)).then(size => setSize(size, position));
    store.setItem('editorPosition', position);
  };

  useEffect(() => {
    const params = getParamsFromQuery();

    if (params.code) {
      try {
        const { code: parsedCode } = JSON.parse(
          lzString.decompressFromEncodedURIComponent(params.code)
        );

        setCode(parsedCode);
      } catch (e) {
        // backward compatibility
        setCode(base64url.decode(params.code));
      }
    }

    Promise.all([
      store.getItem('code'),
      store.getItem('editorPosition'),
      store.getItem('editorHeight'),
      store.getItem('editorWidth')
    ]).then(([storedCode, position, height, width]) => {
      setCode(storedCode || exampleCode);

      if (position) {
        setEditorPosition(position);
      }

      if (width || height) {
        setEditorSize(
          /^(left|right)$/.test(position || defaultPosition) ? width : height
        );
      }
      setReady(true);
    });
  }, []);

  return {
    editorPosition,
    setEditorPosition: setPosition,
    editorSize,
    setEditorSize: setSize,
    code,
    setCode: newCode => {
      setCode(newCode);

      const newUrl = createUrl({ code: newCode });
      history.replaceState(null, null, newUrl);
      store.setItem('code', newCode);
    },
    ready
  };
};
