import type { Editor } from 'codemirror';
import { useRef, useContext, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/theme/neo.css';

import { type CursorPosition, StoreContext } from '../../contexts/StoreContext';
import { validateCode } from '../../utils/compileJsx';
import { hints } from '../../utils/componentsToHints';
import { formatCode as format, isMac } from '../../utils/formatting';

import { UnControlled as ReactCodeMirror } from './CodeMirror2';
import { toggleComment } from './keymaps/comment';
import {
  completeAfter,
  completeIfAfterLt,
  completeIfInTag,
} from './keymaps/complete';
import {
  addCursorToNextLine,
  addCursorToPrevLine,
  selectNextOccurrence,
} from './keymaps/cursors';
import { duplicateLine, swapLineDown, swapLineUp } from './keymaps/lines';
import { wrapInTag } from './keymaps/wrap';

import * as styles from './CodeEditor.css';

import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

const validateCodeInEditor = (editorInstance: Editor, code: string) => {
  const maybeValid = validateCode(code);

  if (maybeValid === true) {
    editorInstance.clearGutter('errorGutter');
  } else {
    const errorMessage = maybeValid.message;
    const lineNumber = maybeValid.loc?.line;

    if (lineNumber) {
      const marker = document.createElement('div');
      marker.setAttribute('class', styles.errorMarker);
      marker.setAttribute('title', errorMessage);
      marker.innerText = String(lineNumber);
      editorInstance.setGutterMarker(lineNumber - 1, 'errorGutter', marker);
    }
  }
};

interface Props {
  code: string;
  onChange: (code: string) => void;
  editorHidden: boolean;
  previewCode?: string;
}

export const CodeEditor = ({
  code,
  editorHidden,
  onChange,
  previewCode,
}: Props) => {
  const mounted = useRef(false);
  const editorInstanceRef = useRef<Editor | null>(null);
  const insertionPointRef = useRef<ReturnType<Editor['addLineClass']> | null>(
    null
  );
  const [{ cursorPosition, highlightLineNumber }, dispatch] =
    useContext(StoreContext);

  const debouncedChange = useDebouncedCallback(
    (newCode: string) => onChange(newCode),
    100
  );

  const setCursorPosition = useCallback(
    ({ line, ch }: CursorPosition) => {
      setTimeout(() => {
        if (editorInstanceRef.current && !previewCode) {
          editorInstanceRef.current.focus();
          editorInstanceRef.current.setCursor(line, ch);
        }
      });
    },
    [previewCode]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editorInstanceRef && editorInstanceRef.current) {
        const cmdOrCtrl = isMac() ? e.metaKey : e.ctrlKey;

        if (cmdOrCtrl && e.key === 's') {
          e.preventDefault();
          const { code: formattedCode, cursor: formattedCursor } = format({
            code: editorInstanceRef.current.getValue(),
            cursor: editorInstanceRef.current.getCursor(),
          });

          dispatch({
            type: 'updateCode',
            payload: { code: formattedCode, cursor: formattedCursor },
          });
          editorInstanceRef.current.setValue(formattedCode);
          editorInstanceRef.current.setCursor(formattedCursor);
        }

        if (cmdOrCtrl && e.key === 'k') {
          e.preventDefault();
          dispatch({ type: 'toggleToolbar', payload: { panel: 'snippets' } });
        }

        // Prevent browser keyboard shortcuts when the search/replace input is focused
        if (
          cmdOrCtrl &&
          document.activeElement?.classList.contains(
            'CodeMirror-search-field'
          ) &&
          e.key === 'f'
        ) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    if (editorInstanceRef.current) {
      if (previewCode) {
        editorInstanceRef.current.setValue(previewCode);
      } else {
        editorInstanceRef.current.getDoc().undo();

        // prevent redo after undo'ing preview code.
        const history = editorInstanceRef.current.getDoc().getHistory();
        editorInstanceRef.current
          .getDoc()
          .setHistory({ ...history, undone: [] });
      }
    }
  }, [previewCode]);

  useEffect(() => {
    if (editorInstanceRef.current) {
      if (
        mounted.current &&
        (code === editorInstanceRef.current.getValue() || previewCode)
      ) {
        return;
      }
      editorInstanceRef.current.setValue(code);
      validateCodeInEditor(editorInstanceRef.current, code);
    }
  }, [code, previewCode]);

  useEffect(() => {
    if (editorInstanceRef.current && !editorInstanceRef.current.hasFocus()) {
      setCursorPosition(cursorPosition);
    }
  }, [cursorPosition, previewCode, setCursorPosition]);

  useEffect(() => {
    if (editorInstanceRef.current) {
      if (typeof highlightLineNumber === 'number') {
        insertionPointRef.current = editorInstanceRef.current.addLineClass(
          highlightLineNumber,
          'background',
          styles.insertionPoint
        );
        editorInstanceRef.current.scrollIntoView(
          {
            line: highlightLineNumber,
            ch: 0,
          },
          200
        );
      } else if (insertionPointRef.current) {
        editorInstanceRef.current.removeLineClass(
          insertionPointRef.current,
          'background'
        );
        insertionPointRef.current = null;
      }
    }
  }, [highlightLineNumber]);

  const keymapModifierKey = isMac() ? 'Cmd' : 'Ctrl';

  return (
    <ReactCodeMirror
      editorDidMount={(editorInstance) => {
        editorInstanceRef.current = editorInstance;
        validateCodeInEditor(editorInstance, code);
        if (!editorHidden) {
          setCursorPosition(cursorPosition);
        }
        /**
         * This workaround delays the setting of the mounted flag. It allows
         * the behaviours wired up via `useEffect` to complete without being
         * interrupted by change or focus events.
         */
        setTimeout(() => {
          mounted.current = true;
        }, 1);
      }}
      onChange={(editorInstance, data, newCode) => {
        if (editorInstance.hasFocus() && !previewCode) {
          validateCodeInEditor(editorInstance, newCode);
          debouncedChange(newCode);
        }
      }}
      onCursorActivity={(editor) => {
        setTimeout(() => {
          if (!editor.somethingSelected() && editor.hasFocus()) {
            const { line, ch } = editor.getCursor();

            dispatch({
              type: 'updateCursorPosition',
              payload: { position: { line, ch }, code: editor.getValue() },
            });
          }
        });
      }}
      options={{
        mode: 'jsx',
        autoCloseTags: true,
        autoCloseBrackets: true,
        theme: 'neo',
        gutters: ['errorGutter', 'CodeMirror-linenumbers', styles.foldGutter],
        hintOptions: { schemaInfo: hints },
        viewportMargin: 50,
        lineNumbers: true,
        styleActiveLine: !previewCode,
        foldGutter: {
          gutter: styles.foldGutter,
          indicatorOpen: styles.foldOpen,
          indicatorFolded: styles.foldFolded,
        },
        foldOptions: {
          widget: '\u2026',
          minFoldSize: 1,
        },
        extraKeys: {
          Tab: (cm) => {
            if (cm.somethingSelected()) {
              cm.indentSelection('add');
            } else {
              const indent = cm.getOption('indentUnit') as number;
              const spaces = Array(indent + 1).join(' ');
              cm.replaceSelection(spaces);
            }
          },
          'Ctrl-Space': completeIfInTag,
          "'<'": completeAfter,
          "'/'": completeIfAfterLt,
          "' '": completeIfInTag,
          "'='": completeIfInTag,
          'Alt-Up': swapLineUp,
          'Alt-Down': swapLineDown,
          'Shift-Alt-Up': duplicateLine('up'),
          'Shift-Alt-Down': duplicateLine('down'),
          [`${keymapModifierKey}-Alt-Up`]: addCursorToPrevLine,
          [`${keymapModifierKey}-Alt-Down`]: addCursorToNextLine,
          [`${keymapModifierKey}-D`]: selectNextOccurrence,
          [`Shift-${keymapModifierKey}-,`]: wrapInTag,
          [`${keymapModifierKey}-/`]: toggleComment,
          [`${keymapModifierKey}-F`]: 'findPersistent',
          [`${keymapModifierKey}-Alt-F`]: 'replace',
          [`${keymapModifierKey}-G`]: 'jumpToLine',
          ['Alt-G']: false, // override default keybinding
          ['Alt-F']: false, // override default keybinding
          ['Shift-Ctrl-R']: false, // override default keybinding
          ['Cmd-Option-F']: false, // override default keybinding
          ['Shift-Cmd-Option-F']: false, // override default keybinding
        },
      }}
    />
  );
};
