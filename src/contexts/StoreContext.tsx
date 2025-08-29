import copy from 'copy-to-clipboard';
import dedent from 'dedent';
import localforage from 'localforage';
import lzString from 'lz-string';
import {
  useEffect,
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { type Snippet, compressParams } from '../../utils';
import playroomConfig from '../config';
import {
  themeNames as availableThemes,
  themesEnabled,
} from '../configModules/themes';
import availableWidths, { type Widths } from '../configModules/widths';
import { isValidLocation } from '../utils/cursor';
import { formatForInsertion, formatAndInsert } from '../utils/formatting';
import { getParamsFromQuery, updateUrlCode } from '../utils/params';

const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

const defaultEditorSize = '40%';
const defaultOrientation = 'horizontal';

export type EditorOrientation = 'horizontal' | 'vertical';
export type ColorScheme = 'light' | 'dark' | 'system';

const applyColorScheme = (colorScheme: Exclude<ColorScheme, 'system'>) => {
  document.documentElement[
    colorScheme === 'dark' ? 'setAttribute' : 'removeAttribute'
  ]('data-playroom-dark', '');
};

function convertAndStoreSizeAsPercentage(
  mode: 'height' | 'width',
  size: number
): string {
  const viewportSize =
    mode === 'height' ? window.innerHeight : window.innerWidth;

  const sizePercentage = (size / viewportSize) * 100;
  const roundedSizePercentage = `${Math.round(sizePercentage)}%`;

  store.setItem(
    `${mode === 'height' ? 'editorHeight' : 'editorWidth'}`,
    roundedSizePercentage
  );

  return `${sizePercentage}%`;
}

interface DebounceUpdateUrl {
  code?: string;
  themes?: string[];
  widths?: Widths;
  title?: string;
  editorHidden?: boolean;
}

export interface CursorPosition {
  line: number;
  ch: number;
}

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
}

interface State {
  code: string;
  title?: string;
  previewRenderCode?: string;
  previewEditorCode?: string;
  highlightLineNumber?: number;
  snippetsOpen: boolean;
  validCursorPosition: boolean;
  cursorPosition: CursorPosition;
  editorHidden: boolean;
  editorOrientation: EditorOrientation;
  editorHeight: string;
  editorWidth: string;
  statusMessage?: StatusMessage;
  selectedThemes: typeof availableThemes;
  selectedWidths: Widths;
  colorScheme: ColorScheme;
}

type Action =
  | { type: 'initialLoad'; payload: Partial<State> }
  | { type: 'updateCode'; payload: { code: string; cursor?: CursorPosition } }
  | {
      type: 'updateCursorPosition';
      payload: { position: CursorPosition; code?: string };
    }
  | { type: 'persistSnippet'; payload: { snippet: Snippet } }
  | { type: 'previewSnippet'; payload: { snippet: Snippet | null } }
  | { type: 'openSnippets' }
  | { type: 'closeSnippets' }
  | { type: 'hideEditor' }
  | { type: 'showEditor' }
  | { type: 'copyToClipboard'; payload: { content: string; message?: string } }
  | { type: 'dismissMessage' }
  | {
      type: 'updateColorScheme';
      payload: { colorScheme: ColorScheme };
    }
  | {
      type: 'updateEditorOrientation';
      payload: { orientation: EditorOrientation };
    }
  | { type: 'updateEditorHeight'; payload: { size: number } }
  | { type: 'updateEditorWidth'; payload: { size: number } }
  | {
      type: 'updateSelectedThemes';
      payload: { themes: typeof availableThemes };
    }
  | { type: 'resetSelectedThemes' }
  | {
      type: 'updateSelectedWidths';
      payload: { widths: Widths };
    }
  | { type: 'resetSelectedWidths' }
  | { type: 'updateTitle'; payload: { title: string } };

const resetPreview = ({
  previewRenderCode,
  previewEditorCode,
  highlightLineNumber,
  ...state
}: State): State => ({
  ...state,
  snippetsOpen: false,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'initialLoad': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'updateCode': {
      const { code, cursor } = action.payload;
      store.setItem('code', code);

      return {
        ...state,
        code,
        cursorPosition: cursor || state.cursorPosition,
      };
    }

    case 'dismissMessage': {
      return {
        ...state,
        statusMessage: undefined,
      };
    }

    case 'copyToClipboard': {
      const { content, message } = action.payload;

      copy(content);

      return {
        ...state,
        statusMessage: message
          ? {
              message,
              tone: 'positive',
            }
          : undefined,
      };
    }

    case 'persistSnippet': {
      const { snippet } = action.payload;

      const { code, cursor } = formatAndInsert({
        code: state.code,
        snippet: snippet.code,
        cursor: state.cursorPosition,
      });

      return {
        ...resetPreview(state),
        code,
        cursorPosition: cursor,
      };
    }

    case 'updateCursorPosition': {
      const { position, code } = action.payload;
      const newCode = code && code !== state.code ? code : state.code;

      return {
        ...state,
        code: newCode,
        cursorPosition: position,
        statusMessage: undefined,
        validCursorPosition: isValidLocation({
          code: newCode,
          cursor: position,
        }),
      };
    }

    case 'previewSnippet': {
      const { snippet } = action.payload;

      const previewRenderCode = snippet
        ? formatAndInsert({
            code: state.code,
            snippet: snippet.code,
            cursor: state.cursorPosition,
          }).code
        : undefined;

      return {
        ...state,
        previewRenderCode,
      };
    }

    case 'openSnippets': {
      const validCursorPosition = isValidLocation({
        code: state.code,
        cursor: state.cursorPosition,
      });

      if (!validCursorPosition) {
        return {
          ...state,
          statusMessage: {
            message: "Can't insert snippet at cursor",
            tone: 'critical',
          },
          validCursorPosition,
        };
      }

      const { code, cursor } = formatForInsertion({
        code: state.code,
        cursor: state.cursorPosition,
      });

      return {
        ...state,
        snippetsOpen: true,
        statusMessage: undefined,
        previewEditorCode: code,
        highlightLineNumber: cursor.line,
      };
    }

    case 'closeSnippets': {
      return resetPreview(state);
    }

    case 'hideEditor': {
      return {
        ...state,
        editorHidden: true,
      };
    }

    case 'showEditor': {
      return {
        ...state,
        editorHidden: false,
      };
    }

    case 'updateColorScheme': {
      const { colorScheme } = action.payload;
      store.setItem('colorScheme', colorScheme);

      return {
        ...state,
        colorScheme,
      };
    }

    case 'updateEditorOrientation': {
      const { orientation } = action.payload;
      store.setItem('editorOrientation', orientation);

      return {
        ...state,
        editorOrientation: orientation,
      };
    }

    case 'updateEditorHeight': {
      const { size } = action.payload;

      const updatedHeightPercentage = convertAndStoreSizeAsPercentage(
        'height',
        size
      );

      return {
        ...state,
        editorHeight: updatedHeightPercentage,
      };
    }

    case 'updateEditorWidth': {
      const { size } = action.payload;
      const updatedWidthPercentage = convertAndStoreSizeAsPercentage(
        'width',
        size
      );

      return {
        ...state,
        editorWidth: updatedWidthPercentage,
      };
    }

    case 'updateSelectedThemes': {
      const { themes } = action.payload;
      const selectedThemes = availableThemes.filter((t) => themes.includes(t));
      store.setItem('visibleThemes', selectedThemes);

      return {
        ...state,
        selectedThemes,
      };
    }

    case 'resetSelectedThemes': {
      store.removeItem('visibleThemes');

      return {
        ...state,
        selectedThemes: [],
      };
    }

    case 'updateSelectedWidths': {
      const { widths } = action.payload;
      const selectedWidths = availableWidths.filter((w) => widths.includes(w));
      store.setItem('visibleWidths', selectedWidths);

      return {
        ...state,
        selectedWidths,
      };
    }

    case 'resetSelectedWidths': {
      store.removeItem('visibleWidths');

      return {
        ...state,
        selectedWidths: [],
      };
    }

    case 'updateTitle': {
      const { title } = action.payload;

      return {
        ...state,
        title,
      };
    }

    default:
      return state;
  }
};

type StoreContextValues = [State, Dispatch<Action>];

const initialState: State = {
  code: exampleCode,
  validCursorPosition: true,
  cursorPosition: { line: 0, ch: 0 },
  snippetsOpen: false,
  editorHidden: false,
  editorOrientation: defaultOrientation,
  editorHeight: defaultEditorSize,
  editorWidth: defaultEditorSize,
  selectedThemes:
    themesEnabled && playroomConfig.defaultVisibleThemes
      ? playroomConfig.defaultVisibleThemes
      : [],
  selectedWidths: playroomConfig.defaultVisibleWidths || [],
  colorScheme: 'system',
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {},
]);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const debouncedCodeUpdate = useDebouncedCallback(
    (params: DebounceUpdateUrl) => {
      // Ensure that when removing theme/width preferences
      // they are also removed from the url. Replacing state
      // with an empty string (returned from `createUrl`)
      // does not do anything, so replacing with `#`
      updateUrlCode(compressParams(params));
    },
    500
  );

  useEffect(() => {
    const params = getParamsFromQuery();
    let codeFromQuery: State['code'];
    let themesFromQuery: State['selectedThemes'];
    let widthsFromQuery: State['selectedWidths'];
    let titleFromQuery: State['title'];
    let editorHiddenFromQuery: State['editorHidden'];

    const paramsCode = params.get('code');
    if (paramsCode) {
      const {
        code: parsedCode,
        themes: parsedThemes,
        widths: parsedWidths,
        title: parsedTitle,
        editorHidden: parsedEditorHidden,
      } = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(paramsCode)) ?? ''
      );

      codeFromQuery = parsedCode;
      editorHiddenFromQuery = parsedEditorHidden;
      themesFromQuery = parsedThemes;
      widthsFromQuery = parsedWidths;
      titleFromQuery = parsedTitle;
    }

    Promise.all([
      store.getItem<State['editorOrientation']>('editorOrientation'),
      store.getItem<State['editorHeight']>('editorHeight'),
      store.getItem<State['editorWidth']>('editorWidth'),
      store.getItem<State['selectedWidths']>('visibleWidths'),
      store.getItem<State['selectedThemes']>('visibleThemes'),
      store.getItem<State['colorScheme']>('colorScheme'),
    ]).then(
      ([
        storedOrientation,
        storedHeight,
        storedWidth,
        storedSelectedWidths,
        storedSelectedThemes,
        storedColorScheme,
      ]) => {
        const code = codeFromQuery || exampleCode;
        const editorOrientation = storedOrientation;
        const editorHeight = storedHeight || defaultEditorSize;
        const editorWidth = storedWidth || defaultEditorSize;
        const editorHidden = editorHiddenFromQuery === true;
        const selectedWidths = widthsFromQuery || storedSelectedWidths;
        const selectedThemes =
          themesEnabled && (themesFromQuery || storedSelectedThemes);
        const colorScheme = storedColorScheme;

        dispatch({
          type: 'initialLoad',
          payload: {
            ...(code ? { code } : {}),
            ...(editorOrientation ? { editorOrientation } : {}),
            ...(editorHeight ? { editorHeight } : {}),
            ...(editorWidth ? { editorWidth } : {}),
            ...(editorHidden ? { editorHidden } : {}),
            ...(selectedThemes ? { selectedThemes } : {}),
            ...(selectedWidths ? { selectedWidths } : {}),
            ...(colorScheme ? { colorScheme } : {}),
            title: titleFromQuery,
          },
        });

        setReady(true);
      }
    );
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (state.colorScheme === 'system') {
      const handler = (e: MediaQueryListEvent) => {
        applyColorScheme(e.matches ? 'dark' : 'light');
      };
      mq.addEventListener('change', handler);
      applyColorScheme(mq.matches ? 'dark' : 'light');

      return () => {
        mq.removeEventListener('change', handler);
      };
    }

    applyColorScheme(state.colorScheme);
  }, [state.colorScheme]);

  useEffect(() => {
    debouncedCodeUpdate({
      code: state.code,
      themes: state.selectedThemes,
      widths: state.selectedWidths,
      title: state.title,
      editorHidden: state.editorHidden,
    });
  }, [
    state.code,
    state.selectedThemes,
    state.selectedWidths,
    state.title,
    state.editorHidden,
    debouncedCodeUpdate,
  ]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {ready ? children : null}
    </StoreContext.Provider>
  );
};
