import dedent from 'dedent';
import localforage from 'localforage';
import {
  useEffect,
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
  type CompressParamsOptions,
  type Snippet,
  compressParams,
} from '../../utils';
import playroomConfig from '../config';
import {
  themeNames as availableThemes,
  themesEnabled,
} from '../configModules/themes';
import availableWidths, { type Widths } from '../configModules/widths';
import { isValidLocation } from '../utils/cursor';
import { formatForInsertion, formatAndInsert } from '../utils/formatting';
import {
  getDataParam,
  resolveDataFromUrl,
  updateUrlCode,
} from '../utils/params';

const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

const defaultEditorSize = '40%';
const defaultOrientation = 'horizontal';
const defaultOpenLayout = 'grid';

export type EditorOrientation = 'horizontal' | 'vertical';
type ColorScheme = 'light' | 'dark' | 'system';
type OpenLayout = 'grid' | 'list';

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

export interface CursorPosition {
  line: number;
  ch: number;
}

type StoredPlayroom = {
  dataParam: string;
  lastModifiedDate: Date;
};
interface State {
  id: string;
  code: string;
  title?: string;
  previewRenderCode?: string;
  previewEditorCode?: string;
  highlightLineNumber?: number;
  snippetsOpen: boolean;
  openDialogOpen: boolean;
  hasSyntaxError?: boolean;
  syntaxErrorLineNumber?: number;
  cursorPosition: CursorPosition;
  editorHidden: boolean;
  editorOrientation: EditorOrientation;
  editorHeight: string;
  editorWidth: string;
  panelsVisible: boolean;
  selectedThemes: typeof availableThemes;
  selectedWidths: Widths;
  colorScheme: ColorScheme;
  openLayout: OpenLayout;
  storedPlayrooms: Record<string, StoredPlayroom>;
}

export type Action =
  | { type: 'initialLoad'; payload: Partial<State> }
  | { type: 'updateCode'; payload: { code: string; cursor?: CursorPosition } }
  | {
      type: 'updateCursorPosition';
      payload: { position: CursorPosition; code?: string };
    }
  | { type: 'persistSnippet'; payload: { snippet: Snippet } }
  | { type: 'previewSnippet'; payload: { snippet: Snippet | null } }
  | { type: 'openPlayroomDialog' }
  | { type: 'closePlayroomDialog' }
  | { type: 'openSnippets' }
  | { type: 'closeSnippets' }
  | { type: 'hideEditor' }
  | { type: 'showEditor' }
  | {
      type: 'setHasSyntaxError';
      payload: { value: boolean; lineNumber?: number };
    }
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
  | { type: 'togglePanelVisibility' }
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
  | { type: 'updateTitle'; payload: { title: string } }
  | {
      type: 'updateOpenLayout';
      payload: { layout: OpenLayout };
    }
  | {
      type: 'openPlayroom';
      payload: {
        id: State['id'];
        code: NonNullable<CompressParamsOptions['code']>;
        title: NonNullable<CompressParamsOptions['title']>;
        themes: NonNullable<CompressParamsOptions['themes']>;
        widths: NonNullable<CompressParamsOptions['widths']>;
        editorHidden?: State['editorHidden'];
      };
    }
  | {
      type: 'storePlayroom';
      payload: {
        id: string;
        dataParam: StoredPlayroom['dataParam'];
      };
    }
  | {
      type: 'deletePlayroom';
      payload: {
        id: string;
      };
    };

const resetPreview = ({
  previewRenderCode,
  previewEditorCode,
  highlightLineNumber,
  ...state
}: State): State => ({
  ...state,
  snippetsOpen: false,
});

const sortStoredPlayrooms = (storedPlayrooms: State['storedPlayrooms']) =>
  Object.fromEntries(
    Object.entries(storedPlayrooms).sort(
      ([, { lastModifiedDate: aDate }], [, { lastModifiedDate: bDate }]) =>
        bDate.getTime() - aDate.getTime()
    )
  );

const createPlayroomId = () =>
  self.crypto.randomUUID
    ? self.crypto.randomUUID()
    : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (
          Number(c) ^
          (crypto.getRandomValues(new Uint8Array(1))[0] &
            (15 >> (Number(c) / 4)))
        ).toString(16)
      );

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

      return {
        ...state,
        code,
        id: !state.id && code.trim().length > 0 ? createPlayroomId() : state.id,
        cursorPosition: cursor || state.cursorPosition,
      };
    }

    case 'setHasSyntaxError': {
      const { value, lineNumber } = action.payload;
      return {
        ...state,
        hasSyntaxError: value,
        syntaxErrorLineNumber: value ? lineNumber : undefined,
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
        id: !state.id && code.trim().length > 0 ? createPlayroomId() : state.id,
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
      if (state.hasSyntaxError) {
        return {
          ...state,
          snippetsOpen: false,
        };
      }

      const validCursorPosition = isValidLocation({
        code: state.code,
        cursor: state.cursorPosition,
      });

      if (!validCursorPosition) {
        return state;
      }

      const { code, cursor } = formatForInsertion({
        code: state.code,
        cursor: state.cursorPosition,
      });

      return {
        ...state,
        snippetsOpen: true,
        previewEditorCode: code,
        highlightLineNumber: cursor.line,
      };
    }

    case 'openPlayroomDialog': {
      return {
        ...state,
        openDialogOpen: true,
      };
    }

    case 'closePlayroomDialog': {
      return {
        ...state,
        openDialogOpen: false,
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
        editorHidden: false,
      };
    }

    case 'updateOpenLayout': {
      const { layout } = action.payload;
      store.setItem('openLayout', layout);

      return {
        ...state,
        openLayout: layout,
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

    case 'togglePanelVisibility': {
      if (state.openDialogOpen || state.snippetsOpen) {
        return state;
      }

      return {
        ...state,
        panelsVisible: !state.panelsVisible,
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
        id:
          !state.id && title.trim().length > 0 ? createPlayroomId() : state.id,
      };
    }

    case 'openPlayroom': {
      const { id, code, title, themes, widths, editorHidden } = action.payload;

      return {
        ...state,
        id,
        code,
        title,
        selectedWidths: widths.length > 0 ? widths : state.selectedWidths, // Maintain local preference in favour of config
        selectedThemes:
          themesEnabled && themes.length > 0 ? themes : state.selectedThemes, // Maintain local preference in favour of config
        editorHidden: editorHidden ?? false,
      };
    }

    case 'storePlayroom': {
      const { id, dataParam } = action.payload;
      const previous = state.storedPlayrooms[id];
      const hasNotChanged = previous?.dataParam === dataParam;
      const hasNothingToSave =
        state.code.trim().length === 0 &&
        (state.title || '').trim().length === 0;

      if (hasNotChanged || hasNothingToSave || state.hasSyntaxError) {
        return state;
      }

      const updatedPlayrooms = {
        ...state.storedPlayrooms,
        [id]: {
          dataParam,
          lastModifiedDate: new Date(),
        },
      };

      store.setItem('playrooms', updatedPlayrooms);

      return {
        ...state,
        storedPlayrooms: sortStoredPlayrooms(updatedPlayrooms),
      };
    }

    case 'deletePlayroom': {
      const { id } = action.payload;
      const { [id]: deletedPlayroom, ...remainingPlayrooms } =
        state.storedPlayrooms;

      store.setItem('playrooms', remainingPlayrooms);

      return {
        ...state,
        storedPlayrooms: remainingPlayrooms,
      };
    }

    default:
      return state;
  }
};

type StoreContextValues = [State, Dispatch<Action>];

const initialState: State = {
  id: '',
  code: exampleCode,
  cursorPosition: { line: 0, ch: 0 },
  snippetsOpen: false,
  openDialogOpen: false,
  editorHidden: false,
  editorOrientation: defaultOrientation,
  editorHeight: defaultEditorSize,
  editorWidth: defaultEditorSize,
  panelsVisible: true,
  selectedThemes:
    themesEnabled && playroomConfig.defaultVisibleThemes
      ? playroomConfig.defaultVisibleThemes
      : [],
  selectedWidths: playroomConfig.defaultVisibleWidths || [],
  colorScheme: 'system',
  openLayout: defaultOpenLayout,
  storedPlayrooms: {},
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {},
]);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const debouncedCodeUpdate = useDebouncedCallback(
    (params: Parameters<typeof compressParams>[0]) => {
      const newParams = compressParams(params);
      updateUrlCode(newParams);

      if (state.id) {
        dispatch({
          type: 'storePlayroom',
          payload: {
            id: state.id,
            dataParam: newParams,
          },
        });
      }
    },
    500
  );

  useEffect(() => {
    const {
      code,
      themes: themesFromUrl,
      widths: widthsFromUrl,
      title,
      editorHidden,
    } = resolveDataFromUrl();
    const dataParamFromUrl = getDataParam();

    Promise.all([
      store.getItem<State['editorOrientation']>('editorOrientation'),
      store.getItem<State['editorHeight']>('editorHeight'),
      store.getItem<State['editorWidth']>('editorWidth'),
      store.getItem<State['selectedWidths']>('visibleWidths'),
      store.getItem<State['selectedThemes']>('visibleThemes'),
      store.getItem<State['colorScheme']>('colorScheme'),
      store.getItem<State['openLayout']>('openLayout'),
      store.getItem<State['storedPlayrooms']>('playrooms'),
    ]).then(
      ([
        editorOrientation,
        editorHeight,
        editorWidth,
        storedSelectedWidths,
        storedSelectedThemes,
        colorScheme,
        openLayout,
        storedPlayrooms,
      ]) => {
        const filteredUrlWidths = widthsFromUrl
          ? availableWidths.filter((w) => widthsFromUrl.includes(w))
          : [];
        const filteredStoredSelectedWidths = storedSelectedWidths
          ? availableWidths.filter((w) => storedSelectedWidths.includes(w))
          : [];
        const selectedWidths = filteredUrlWidths.length
          ? filteredUrlWidths
          : filteredStoredSelectedWidths;

        const filteredUrlThemes = themesFromUrl
          ? availableThemes.filter((t) => themesFromUrl.includes(t))
          : [];
        const filteredStoredSelectedThemes = storedSelectedThemes
          ? availableThemes.filter((t) => storedSelectedThemes.includes(t))
          : [];
        const selectedThemes = filteredUrlThemes.length
          ? filteredUrlThemes
          : filteredStoredSelectedThemes;

        const storedPlayroomValues = Object.entries(storedPlayrooms || {});
        let id = code || title ? createPlayroomId() : '';

        // If the playroom from the URL matches a storage entry,
        // assume same id to enable updating to handle refresh case.
        if (storedPlayrooms) {
          const matchingPlayroom = storedPlayroomValues.find(
            ([_, { dataParam }]) => dataParamFromUrl === dataParam
          );

          if (matchingPlayroom) {
            id = matchingPlayroom[0];
          }
        }

        dispatch({
          type: 'initialLoad',
          payload: {
            ...(id ? { id } : {}),
            ...(code ? { code } : {}),
            ...(editorOrientation ? { editorOrientation } : {}),
            ...(editorHeight ? { editorHeight } : {}),
            ...(editorWidth ? { editorWidth } : {}),
            ...(editorHidden ? { editorHidden } : {}),
            ...(themesEnabled && selectedThemes.length > 0
              ? { selectedThemes }
              : {}),
            ...(selectedWidths.length > 0 ? { selectedWidths } : {}),
            ...(colorScheme ? { colorScheme } : {}),
            ...(openLayout ? { openLayout } : {}),
            ...(storedPlayrooms
              ? { storedPlayrooms: sortStoredPlayrooms(storedPlayrooms) }
              : {}),
            title,
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
