import { useContext, useEffect } from 'react';

import { useEditor } from '../contexts/EditorContext';
import { StoreContext } from '../contexts/StoreContext';
import { isMac } from '../utils/formatting';

export const useGlobalKeyboardShortcutsForWindow = (win: Window | null) => {
  const [
    { editorHidden, openDialogOpen, snippetsOpen, inspectMode },
    dispatch,
  ] = useContext(StoreContext);
  const { runCommand } = useEditor();
  const formattable = !editorHidden && !openDialogOpen && !snippetsOpen;

  useEffect(() => {
    if (win === null) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspectMode) {
        e.preventDefault();
        dispatch({ type: 'disableInspectMode' });
        return;
      }

      const cmdOrCtrl = isMac() ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl) {
        switch (e.key) {
          case 'o': {
            e.preventDefault();
            dispatch({ type: 'openPlayroomDialog' });
            break;
          }
          case '\\': {
            e.preventDefault();
            dispatch({ type: 'togglePanelVisibility' });
            break;
          }
          case 's': {
            e.preventDefault();
            if (formattable) {
              runCommand('formatCode');
            }
            break;
          }
          case 'c': {
            if (e.shiftKey) {
              e.preventDefault();
              dispatch({
                type: inspectMode ? 'disableInspectMode' : 'enableInspectMode',
              });
            }
            break;
          }
        }
        return;
      }
    };

    win.addEventListener('keydown', handleKeyDown);

    return () => {
      win.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, formattable, inspectMode, runCommand, win]);
};
