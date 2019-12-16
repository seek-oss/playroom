import React, {
  useEffect,
  createContext,
  useReducer,
  ReactNode,
  Dispatch
} from 'react';
import localforage from 'localforage';
import base64url from 'base64-url';
import lzString from 'lz-string';
import dedent from 'dedent';
import { useDebouncedCallback } from 'use-debounce';

import { createUrl, CreateUrlOptions } from '../../utils';
import getParamsFromQuery from '../utils/getParamsFromQuery';

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);
const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1
});

const defaultPosition = 'bottom';

export type EditorPosition = 'bottom' | 'right' | 'undocked';

interface DebounceUpdateUrl
  extends Partial<Omit<CreateUrlOptions, 'baseUrl'>> {}

interface State {
  code: string;
  editorPosition: EditorPosition;
  editorHeight: number;
  editorWidth: number;
  visibleThemes?: string[];
  visibleWidths?: number[];
  ready: boolean;
}

type Action =
  | { type: 'initialLoad'; payload: Partial<State> }
  | { type: 'updateCode'; payload: { code: string } }
  | {
      type: 'updateEditorPosition';
      payload: { position: EditorPosition };
    }
  | { type: 'resetEditorPosition' }
  | { type: 'updateEditorHeight'; payload: { size: number } }
  | { type: 'updateEditorWidth'; payload: { size: number } }
  | { type: 'updateVisibleThemes'; payload: { themes: string[] } }
  | { type: 'resetVisibleThemes' }
  | { type: 'updateVisibleWidths'; payload: { widths: number[] } }
  | { type: 'resetVisibleWidths' };

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
      store.setItem('code', code);

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

    case 'updateVisibleThemes': {
      const { themes } = action.payload;
      store.setItem('visibleThemes', themes);

      return {
        ...state,
        visibleThemes: themes
      };
    }

    case 'resetVisibleThemes': {
      const { visibleThemes, ...restState } = state;
      store.removeItem('visibleThemes');

      return restState;
    }

    case 'updateVisibleWidths': {
      const { widths } = action.payload;
      const orderedWidths = widths.sort((a, b) => a - b);

      store.setItem('visibleWidths', orderedWidths);

      return {
        ...state,
        visibleWidths: orderedWidths
      };
    }

    case 'resetVisibleWidths': {
      const { visibleWidths, ...restState } = state;
      store.removeItem('visibleWidths');

      return restState;
    }

    default:
      return state;
  }
};

type StoreContextValues = [State, Dispatch<Action>];

const initialState: State = {
  code: exampleCode,
  editorPosition: defaultPosition,
  editorHeight: 300,
  editorWidth: 360,
  ready: false
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {}
]);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [debouncedCodeUpdate] = useDebouncedCallback(
    (params: DebounceUpdateUrl) => {
      history.replaceState(null, '', createUrl(params));
    },
    500
  );

  useEffect(() => {
    const params = getParamsFromQuery();
    let codeFromQuery: State['code'];
    let themesFromQuery: State['visibleThemes'];
    let widthsFromQuery: State['visibleWidths'];

    if (params.code) {
      try {
        const {
          code: parsedCode,
          themes: parsedThemes,
          widths: parsedWidths
        } = JSON.parse(
          lzString.decompressFromEncodedURIComponent(String(params.code))
        );

        codeFromQuery = parsedCode;
        themesFromQuery = parsedThemes;
        widthsFromQuery = parsedWidths;
      } catch (e) {
        // backward compatibility
        codeFromQuery = base64url.decode(String(params.code));
      }
    }

    Promise.all<string, EditorPosition, number, number, string[], number[]>([
      store.getItem('code'),
      store.getItem('editorPosition'),
      store.getItem('editorHeight'),
      store.getItem('editorWidth'),
      store.getItem('visibleThemes'),
      store.getItem('visibleWidths')
    ]).then(
      ([
        storedCode,
        storedPosition,
        storedHeight,
        storedWidth,
        storedVisibleThemes,
        storedVisibleWidths
      ]) => {
        const code = codeFromQuery || storedCode || exampleCode;
        const editorPosition = storedPosition;
        const editorHeight = storedHeight;
        const editorWidth = storedWidth;
        const visibleThemes = themesFromQuery || storedVisibleThemes;
        const visibleWidths = widthsFromQuery || storedVisibleWidths;

        dispatch({
          type: 'initialLoad',
          payload: {
            ...(code ? { code } : {}),
            ...(editorPosition ? { editorPosition } : {}),
            ...(editorHeight ? { editorHeight } : {}),
            ...(editorWidth ? { editorWidth } : {}),
            ...(visibleThemes ? { visibleThemes } : {}),
            ...(visibleWidths ? { visibleWidths } : {}),
            ready: true
          }
        });
      }
    );
  }, []);

  useEffect(() => {
    debouncedCodeUpdate({
      code: state.code,
      themes: state.visibleThemes,
      widths: state.visibleWidths
    });
  }, [
    state.code,
    state.visibleThemes,
    state.visibleWidths,
    debouncedCodeUpdate
  ]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
