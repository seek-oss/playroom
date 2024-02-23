import {
  useEffect,
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import copy from 'copy-to-clipboard';
import localforage from 'localforage';
import lzString from 'lz-string';
import dedent from 'dedent';
import { useDebouncedCallback } from 'use-debounce';

import { type Snippet, compressParams } from '../../utils';
import { formatForInsertion, formatAndInsert } from '../utils/formatting';
import { getParamsFromQuery, updateUrlCode } from '../utils/params';
import type { PlayroomProps } from '../Playroom/Playroom';
import { isValidLocation } from '../utils/cursor';
import playroomConfig from '../config';

const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

const defaultPosition = 'bottom';

export type EditorPosition = 'bottom' | 'right' | 'undocked';
export type ColorScheme = 'light' | 'dark' | 'system';

const applyColorScheme = (colorScheme: Exclude<ColorScheme, 'system'>) => {
  document.documentElement[
    colorScheme === 'dark' ? 'setAttribute' : 'removeAttribute'
  ]('data-playroom-dark', '');
};

interface DebounceUpdateUrl {
  code?: string;
  themes?: string[];
  widths?: number[];
  title?: string;
}

export interface CursorPosition {
  line: number;
  ch: number;
}

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
}

type ToolbarPanel = 'snippets' | 'frames' | 'preview' | 'settings';
interface State {
  code: string;
  title?: string;
  previewRenderCode?: string;
  previewEditorCode?: string;
  highlightLineNumber?: number;
  activeToolbarPanel?: ToolbarPanel;
  validCursorPosition: boolean;
  cursorPosition: CursorPosition;
  editorHidden: boolean;
  editorPosition: EditorPosition;
  editorHeight: number;
  editorWidth: number;
  statusMessage?: StatusMessage;
  visibleThemes?: string[];
  visibleWidths?: number[];
  ready: boolean;
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
  | { type: 'toggleToolbar'; payload: { panel: ToolbarPanel } }
  | { type: 'closeToolbar' }
  | { type: 'hideEditor' }
  | { type: 'showEditor' }
  | {
      type: 'copyToClipboard';
      payload: { url: string; trigger: 'toolbarItem' | 'previewPanel' };
    }
  | { type: 'dismissMessage' }
  | {
      type: 'updateColorScheme';
      payload: { colorScheme: ColorScheme };
    }
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
  | { type: 'resetVisibleWidths' }
  | { type: 'updateTitle'; payload: { title: string } };

const resetPreview = ({
  previewRenderCode,
  previewEditorCode,
  highlightLineNumber,
  ...state
}: State): State => state;

interface CreateReducerParams {
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}
const createReducer =
  ({
    themes: configuredThemes,
    widths: configuredWidths,
  }: CreateReducerParams) =>
  (state: State, action: Action): State => {
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
        const { url, trigger } = action.payload;

        copy(url);

        return {
          ...state,
          statusMessage:
            trigger === 'toolbarItem'
              ? {
                  message: 'Copied to clipboard',
                  tone: 'positive',
                }
              : undefined,
        };
      }

      case 'persistSnippet': {
        const { snippet } = action.payload;
        const { activeToolbarPanel, ...currentState } = state;

        const { code, cursor } = formatAndInsert({
          code: state.code,
          snippet: snippet.code,
          cursor: state.cursorPosition,
        });

        return {
          ...resetPreview(currentState),
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

      case 'toggleToolbar': {
        const { panel } = action.payload;
        const { activeToolbarPanel: currentPanel, ...currentState } = state;
        const shouldOpen = panel !== currentPanel;

        if (shouldOpen) {
          if (panel === 'preview' && state.code.trim().length === 0) {
            return {
              ...state,
              statusMessage: {
                message: 'Must have code to preview',
                tone: 'critical',
              },
            };
          }

          if (panel === 'snippets') {
            const validCursorPosition = isValidLocation({
              code: currentState.code,
              cursor: currentState.cursorPosition,
            });

            if (!validCursorPosition) {
              return {
                ...currentState,
                statusMessage: {
                  message: "Can't insert snippet at cursor",
                  tone: 'critical',
                },
                validCursorPosition,
              };
            }

            const { code, cursor } = formatForInsertion({
              code: currentState.code,
              cursor: currentState.cursorPosition,
            });

            return {
              ...currentState,
              statusMessage: undefined,
              activeToolbarPanel: panel,
              previewEditorCode: code,
              highlightLineNumber: cursor.line,
            };
          }

          return {
            ...resetPreview(currentState),
            statusMessage: undefined,
            activeToolbarPanel: panel,
          };
        }

        return resetPreview(currentState);
      }

      case 'closeToolbar': {
        const { activeToolbarPanel, ...currentState } = state;

        return resetPreview(currentState);
      }

      case 'hideEditor': {
        return {
          ...state,
          activeToolbarPanel: undefined,
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

      case 'updateEditorPosition': {
        const { position } = action.payload;
        store.setItem('editorPosition', position);

        return {
          ...state,
          editorPosition: position,
        };
      }

      case 'resetEditorPosition': {
        store.setItem('editorPosition', defaultPosition);

        return {
          ...state,
          editorPosition: defaultPosition,
        };
      }

      case 'updateEditorHeight': {
        const { size } = action.payload;
        store.setItem('editorHeight', size);

        return {
          ...state,
          editorHeight: size,
        };
      }

      case 'updateEditorWidth': {
        const { size } = action.payload;
        store.setItem('editorWidth', size);

        return {
          ...state,
          editorWidth: size,
        };
      }

      case 'updateVisibleThemes': {
        const { themes } = action.payload;
        const visibleThemes = configuredThemes.filter((t) =>
          themes.includes(t)
        );
        store.setItem('visibleThemes', visibleThemes);

        return {
          ...state,
          visibleThemes,
        };
      }

      case 'resetVisibleThemes': {
        const { visibleThemes, ...restState } = state;
        store.removeItem('visibleThemes');

        return restState;
      }

      case 'updateVisibleWidths': {
        const { widths } = action.payload;
        const visibleWidths = configuredWidths.filter((w) =>
          widths.includes(w)
        );
        store.setItem('visibleWidths', visibleWidths);

        return {
          ...state,
          visibleWidths,
        };
      }

      case 'resetVisibleWidths': {
        const { visibleWidths, ...restState } = state;
        store.removeItem('visibleWidths');

        return restState;
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
  editorHidden: false,
  editorPosition: defaultPosition,
  editorHeight: 300,
  editorWidth: 360,
  ready: false,
  colorScheme: 'light',
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {},
]);

export const StoreProvider = ({
  children,
  themes,
  widths,
}: {
  children: ReactNode;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}) => {
  const [state, dispatch] = useReducer(
    createReducer({ themes, widths }),
    initialState
  );
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
  const hasThemesConfigured =
    (themes || []).filter((themeName) => themeName !== '__PLAYROOM__NO_THEME__')
      .length > 0;

  useEffect(() => {
    const params = getParamsFromQuery();
    let codeFromQuery: State['code'];
    let themesFromQuery: State['visibleThemes'];
    let widthsFromQuery: State['visibleWidths'];
    let titleFromQuery: State['title'];

    if (params.code) {
      const {
        code: parsedCode,
        themes: parsedThemes,
        widths: parsedWidths,
        title: parsedTitle,
      } = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(params.code)) ?? ''
      );

      codeFromQuery = parsedCode;
      themesFromQuery = parsedThemes;
      widthsFromQuery = parsedWidths;
      titleFromQuery = parsedTitle;
    }

    Promise.all([
      store.getItem<string>('code'),
      store.getItem<EditorPosition>('editorPosition'),
      store.getItem<number>('editorHeight'),
      store.getItem<number>('editorWidth'),
      store.getItem<number[]>('visibleWidths'),
      store.getItem<string[]>('visibleThemes'),
      store.getItem<ColorScheme>('colorScheme'),
    ]).then(
      ([
        storedCode,
        storedPosition,
        storedHeight,
        storedWidth,
        storedVisibleWidths,
        storedVisibleThemes,
        storedColorScheme,
      ]) => {
        const code = codeFromQuery || storedCode || exampleCode;
        const editorPosition = storedPosition;
        const editorHeight = storedHeight;
        const editorWidth = storedWidth;
        const visibleWidths =
          widthsFromQuery ||
          storedVisibleWidths ||
          playroomConfig?.defaultVisibleWidths;
        const visibleThemes =
          hasThemesConfigured &&
          (themesFromQuery ||
            storedVisibleThemes ||
            playroomConfig?.defaultVisibleThemes);
        const colorScheme = storedColorScheme;

        dispatch({
          type: 'initialLoad',
          payload: {
            ...(code ? { code } : {}),
            ...(editorPosition ? { editorPosition } : {}),
            ...(editorHeight ? { editorHeight } : {}),
            ...(editorWidth ? { editorWidth } : {}),
            ...(visibleThemes ? { visibleThemes } : {}),
            ...(visibleWidths ? { visibleWidths } : {}),
            ...(colorScheme ? { colorScheme } : {}),
            title: titleFromQuery,
            ready: true,
          },
        });
      }
    );
  }, [hasThemesConfigured]);

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
      themes: state.visibleThemes,
      widths: state.visibleWidths,
      title: state.title,
    });
  }, [
    state.code,
    state.visibleThemes,
    state.visibleWidths,
    state.title,
    debouncedCodeUpdate,
  ]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
