import localforage from 'localforage';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
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
type PreferencesContext = {
  editorOrientation: EditorOrientation;
  setEditorOrientation?: Dispatch<SetStateAction<EditorOrientation>>;
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

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [editorOrientation, setEditorOrientation] =
    useState<EditorOrientation>('horizontal');

  useEffect(() => {
    Promise.all([store.getItem<EditorOrientation>('editorOrientation')]).then(
      ([storedEditorOrientation]) => {
        if (storedEditorOrientation) {
          setEditorOrientation(storedEditorOrientation);
        }

        setReady(true);
      }
    );
  }, []);

  const context = useMemo(
    () => ({
      editorOrientation,
      setEditorOrientation: setAndStore<EditorOrientation>(
        setEditorOrientation,
        'editorOrientation'
      ),
    }),
    [editorOrientation]
  );

  return ready ? (
    <PreferencesContext.Provider value={context}>
      {children}
    </PreferencesContext.Provider>
  ) : null;
};
