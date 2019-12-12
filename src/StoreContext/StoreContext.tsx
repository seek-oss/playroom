import React, {
  useEffect,
  createContext,
  useReducer,
  useRef,
  ReactNode,
  Dispatch
} from 'react';
import localforage from 'localforage';
import base64url from 'base64-url';
import lzString from 'lz-string';
import dedent from 'dedent';

import { createUrl } from '../../utils';
import getParamsFromQuery from '../utils/getParamsFromQuery';
import debounce from 'lodash/debounce';

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);
const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1
});

const defaultPosition = 'bottom';

export type EditorPosition = 'bottom' | 'left' | 'right' | 'undocked';

interface State {
  code: string;
  editorPosition: EditorPosition;
  editorHeight: number;
  editorWidth: number;
  ready: boolean;
}

export type Action =
  | { type: 'initialLoad'; payload: Partial<State> }
  | { type: 'updateCode'; payload: { code: string } }
  | {
      type: 'updateEditorPosition';
      payload: { position: EditorPosition };
    }
  | { type: 'resetEditorPosition' }
  | { type: 'updateEditorHeight'; payload: { size: number } }
  | { type: 'updateEditorWidth'; payload: { size: number } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'initialLoad': {
      return {
        ...state,
        ...action.payload
      };
    }

    case 'updateCode': {
      const { code } = action.payload;

      return {
        ...state,
        code
      };
    }

    case 'updateEditorPosition': {
      const { position } = action.payload;
      store.setItem('editorPosition', position);

      return {
        ...state,
        editorPosition: position
      };
    }

    case 'resetEditorPosition': {
      store.setItem('editorPosition', defaultPosition);

      return {
        ...state,
        editorPosition: defaultPosition
      };
    }

    case 'updateEditorHeight': {
      const { size } = action.payload;
      store.setItem('editorHeight', size);

      return {
        ...state,
        editorHeight: size
      };
    }

    case 'updateEditorWidth': {
      const { size } = action.payload;
      store.setItem('editorWidth', size);

      return {
        ...state,
        editorWidth: size
      };
    }

    default:
      return state;
  }
};

type StoreContextValues = [State, Dispatch<Action>];

const initialState: State = {
  code: exampleCode,
  editorPosition: defaultPosition,
  editorHeight: 200,
  editorWidth: 400,
  ready: false
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {}
]);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const debouncedCodeUpdate = useRef(
    debounce((newCode: string) => {
      history.replaceState(null, '', createUrl({ code: newCode }));
      store.setItem('code', newCode);
    }, 500)
  );

  useEffect(() => {
    const params = getParamsFromQuery();
    let codeFromQuery: string | null = null;

    if (params.code) {
      try {
        const { code: parsedCode } = JSON.parse(
          lzString.decompressFromEncodedURIComponent(String(params.code))
        );

        codeFromQuery = parsedCode;
      } catch (e) {
        // backward compatibility
        codeFromQuery = base64url.decode(String(params.code));
      }
    }

    Promise.all<string, EditorPosition, number, number>([
      store.getItem('code'),
      store.getItem('editorPosition'),
      store.getItem('editorHeight'),
      store.getItem('editorWidth')
    ]).then(([storedCode, storedPosition, storedHeight, storedWidth]) => {
      const code = codeFromQuery || storedCode || exampleCode;
      const editorPosition = storedPosition;
      const editorHeight = storedHeight;
      const editorWidth = storedWidth;

      dispatch({
        type: 'initialLoad',
        payload: {
          ...(code ? { code } : {}),
          ...(editorPosition ? { editorPosition } : {}),
          ...(editorHeight ? { editorHeight } : {}),
          ...(editorWidth ? { editorWidth } : {}),
          ready: true
        }
      });
    });
  }, []);

  useEffect(() => debouncedCodeUpdate.current(state.code), [state.code]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
