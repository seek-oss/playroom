import localforage from 'localforage';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import playroomConfig from '../config';

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

export type EditorOrientation = 'horizontal' | 'vertical';

type SetPreference<S> = Dispatch<SetStateAction<S>>;
type PreferencesContext = {
  editorOrientation: EditorOrientation;
  setEditorOrientation?: SetPreference<EditorOrientation>;
  editorHeight: string;
  editorWidth: string;
  setEditorSize: (size: number) => void;
};

export const PreferencesContext = createContext<PreferencesContext | null>(
  null
);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('PreferencesContext is missing.');
  }

  return context;
};

/**
 * Returns a function that sets a preference value on context
 * with a side effect of storing that value locally in indexeddb.
 */
function setAndStore<StateValue>(
  setState: Dispatch<SetStateAction<StateValue>>,
  key: string
): Dispatch<SetStateAction<StateValue>> {
  return (state: SetStateAction<StateValue>) => {
    if (typeof state === 'function') {
      setState((prevState) => {
        const newState = (state as (prevState: StateValue) => StateValue)(
          prevState
        );
        store.setItem(key, newState);
        return newState;
      });
    } else {
      setState(state);
      store.setItem(key, state);
    }
  };
}

const defaultEditorSize = '40%';
export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [editorOrientation, setEditorOrientation] =
    useState<EditorOrientation>('horizontal');
  const [editorHeight, setEditorHeight] = useState<string>(defaultEditorSize);
  const [editorWidth, setEditorWidth] = useState<string>(defaultEditorSize);

  useEffect(() => {
    Promise.all([
      store.getItem<EditorOrientation>('editorOrientation'),
      store.getItem<string>('editorHeight'),
      store.getItem<string>('editorWidth'),
    ]).then(([storedEditorOrientation, storedHeight, storedWidth]) => {
      if (storedEditorOrientation) {
        setEditorOrientation(storedEditorOrientation);
      }
      if (storedHeight) {
        setEditorHeight(storedHeight);
      }
      if (storedWidth) {
        setEditorWidth(storedWidth);
      }

      setReady(true);
    });
  }, []);

  /**
   * Single function for managing the stored editor size per orientation,
   * responsible for:
   * - Converting the number from the resize event into a percentage.
   * - Updating the relevant preference for current orientation.
   * - Sets the exact preference to prevent movement.
   * - Stores to rounded preference for simplicity
   */
  const setEditorSize = useCallback(
    (size: number) => {
      const isHorizontal = editorOrientation === 'horizontal';
      const viewportSize = isHorizontal
        ? window.innerHeight
        : window.innerWidth;
      const sizePercentage = (size / viewportSize) * 100;
      const exactSizePercentage = `${sizePercentage}%`;
      const roundedSizePercentage = `${Math.round(sizePercentage)}%`;

      if (isHorizontal) {
        setEditorHeight(exactSizePercentage);
      } else {
        setEditorWidth(exactSizePercentage);
      }

      store.setItem(
        `${isHorizontal ? 'editorHeight' : 'editorWidth'}`,
        roundedSizePercentage
      );
    },
    [editorOrientation]
  );

  const context = useMemo(
    () => ({
      editorOrientation,
      setEditorOrientation: setAndStore<EditorOrientation>(
        setEditorOrientation,
        'editorOrientation'
      ),
      editorHeight,
      editorWidth,
      setEditorSize,
    }),
    [editorOrientation, editorHeight, editorWidth, setEditorSize]
  );

  return ready ? (
    <PreferencesContext.Provider value={context}>
      {children}
    </PreferencesContext.Provider>
  ) : null;
};
