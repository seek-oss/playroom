import type { Editor } from 'codemirror';
import {
  useRef,
  useContext,
  useEffect,
  useCallback,
  type Dispatch,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/theme/neo.css';

import { useEditor } from '../../contexts/EditorContext';
import {
  type Action,
  type CursorPosition,
  StoreContext,
} from '../../contexts/StoreContext';
import { validateCode } from '../../utils/compileJsx';
import { hints } from '../../utils/componentsToHints';
import { isValidLocation } from '../../utils/cursor';
import { isMac } from '../../utils/formatting';
import { Tooltip } from '../Tooltip/Tooltip';

import { UnControlled as ReactCodeMirror } from './CodeMirror2';
import { editorCommandList } from './editorCommands';
import { editorErrorDelay } from './editorErrorDelay';
import {
  completeAfter,
  completeIfAfterLt,
  completeIfInTag,
} from './keymaps/complete';
import './registerKeymaps';

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

const editorCommands = editorCommandList.reduce(
  (acc, { shortcut, command }) => ({
    ...acc,
    [shortcut.join('-')]: command,
  }),
  {}
);

const validateCodeInEditor = (
  editorInstance: Editor,
  code: string,
  dispatch: Dispatch<Action>
) => {
  const maybeValid = validateCode(code);

  if (maybeValid === true) {
    editorInstance.clearGutter('errorGutter');
    dispatch({ type: 'setHasSyntaxError', payload: { value: false } });
  } else {
    const lineNumber = maybeValid.loc?.line;
    dispatch({
      type: 'setHasSyntaxError',
      payload: {
        value: true,
        lineNumber:
          typeof lineNumber === 'number'
            ? lineNumber - 1 // Offset the wrapping fragment
            : undefined,
      },
    });
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
  const { registerEditor } = useEditor();
  const previewSnippetsCode = useRef(false);
  const cursorErrorMarkerRef = useRef<HTMLButtonElement | null>(null);
  const invalidSnippetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const errorGutterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [invalidSnippetLocation, setInvalidSnippetLocation] = useState(false);
  const editorInstanceRef = useRef<Editor | null>(null);
  const insertionPointRef = useRef<ReturnType<Editor['addLineClass']> | null>(
    null
  );
  const [
    {
      cursorPosition,
      syntaxErrorLineNumber,
      hasSyntaxError,
      highlightLineNumber,
    },
    dispatch,
  ] = useContext(StoreContext);

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
    if (hasSyntaxError && typeof syntaxErrorLineNumber === 'number') {
      const marker = document.createElement('div');
      marker.setAttribute('class', styles.errorMarker);
      marker.innerText = String(syntaxErrorLineNumber + 1); // Offset the wrapping fragment
      editorInstanceRef.current?.setGutterMarker(
        syntaxErrorLineNumber,
        'errorGutter',
        marker
      );

      // Using timeout to transition in after delay, aligned with error message
      errorGutterTimeoutRef.current = setTimeout(() => {
        marker.classList.add(styles.showErrorMarker);
      }, editorErrorDelay);
    }

    return () => {
      editorInstanceRef.current?.clearGutter('errorGutter');
      if (errorGutterTimeoutRef.current) {
        clearTimeout(errorGutterTimeoutRef.current);
        errorGutterTimeoutRef.current = null;
      }
    };
  }, [hasSyntaxError, syntaxErrorLineNumber]);

  useEffect(() => {
    if (invalidSnippetLocation) {
      invalidSnippetTimeoutRef.current = setTimeout(
        () => setInvalidSnippetLocation(false),
        2000
      );
    }

    return () => {
      if (invalidSnippetTimeoutRef.current) {
        clearTimeout(invalidSnippetTimeoutRef.current);
      }
    };
  }, [invalidSnippetLocation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editorInstanceRef && editorInstanceRef.current) {
        const cmdOrCtrl = isMac() ? e.metaKey : e.ctrlKey;

        if (cmdOrCtrl && e.key === 'k') {
          e.preventDefault();

          const validCursorPosition = isValidLocation({
            code: editorInstanceRef.current.getValue(),
            cursor: editorInstanceRef.current.getCursor(),
          });

          if (validCursorPosition) {
            dispatch({ type: 'openSnippets' });
          } else if (cursorErrorMarkerRef.current) {
            const cursorPos = editorInstanceRef.current.cursorCoords(
              true,
              'local'
            );
            const scrollOffset = editorInstanceRef.current.getScrollInfo();
            const gutterWidth = editorInstanceRef.current
              .getGutterElement()
              .getBoundingClientRect().width;
            cursorErrorMarkerRef.current.style.top = `${
              cursorPos.top - scrollOffset.top
            }px`;
            cursorErrorMarkerRef.current.style.left = `${
              cursorPos.left + gutterWidth - scrollOffset.left
            }px`;
            cursorErrorMarkerRef.current.style.height = `${
              cursorPos.bottom - cursorPos.top
            }px`;
            setInvalidSnippetLocation(true);
          }
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
    if (!editorInstanceRef.current) {
      return;
    }

    if (previewCode) {
      editorInstanceRef.current.setValue(previewCode);
      previewSnippetsCode.current = true;
    } else if (previewSnippetsCode.current) {
      // If existing snippets preview, remove the preview code
      // from the undo history.
      editorInstanceRef.current.getDoc().undo();

      // prevent redo after undo'ing preview code.
      const history = editorInstanceRef.current.getDoc().getHistory();
      editorInstanceRef.current.getDoc().setHistory({ ...history, undone: [] });

      previewSnippetsCode.current = false;
    }
  }, [previewCode]);

  useEffect(() => {
    if (!editorInstanceRef.current) {
      return;
    }

    if (
      editorInstanceRef.current.hasFocus() ||
      code === editorInstanceRef.current.getValue() ||
      previewCode
    ) {
      return;
    }
    editorInstanceRef.current.setValue(code);
    validateCodeInEditor(editorInstanceRef.current, code, dispatch);
  }, [code, previewCode, dispatch]);

  useEffect(() => {
    if (editorInstanceRef.current && !editorInstanceRef.current.hasFocus()) {
      setCursorPosition(cursorPosition);
    }
  }, [cursorPosition, previewCode, setCursorPosition]);

  useEffect(() => {
    if (!editorInstanceRef.current) {
      return;
    }

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
  }, [highlightLineNumber]);

  return (
    <>
      <ReactCodeMirror
        editorDidMount={(editorInstance) => {
          editorInstanceRef.current = editorInstance;
          editorInstanceRef.current.setValue(code);
          validateCodeInEditor(editorInstance, code, dispatch);
          if (!editorHidden) {
            setCursorPosition(cursorPosition);
          }
          registerEditor(editorInstance);
        }}
        onChange={(editorInstance, data, newCode) => {
          if (editorInstance.hasFocus() && !previewCode) {
            validateCodeInEditor(editorInstance, newCode, dispatch);
            debouncedChange(newCode);
          }
        }}
        onCursorActivity={(editor) => {
          setInvalidSnippetLocation(false);
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
          cursorScrollMargin: 100,
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
            Esc: invalidSnippetLocation
              ? () => setInvalidSnippetLocation(false)
              : false,
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
            'Alt-G': false, // override default keybinding
            'Alt-F': false, // override default keybinding
            'Shift-Ctrl-R': false, // override default keybinding
            'Cmd-Option-F': false, // override default keybinding
            'Shift-Cmd-Option-F': false, // override default keybinding
            ...editorCommands,
          },
        }}
      />
      <Tooltip
        open={invalidSnippetLocation}
        label="Can only insert between tags"
        ref={cursorErrorMarkerRef}
        side="bottom"
        sideOffset={2}
        trigger={
          <span
            style={{
              position: 'absolute',
              pointerEvents: 'none',
            }}
            tabIndex={-1}
          />
        }
      />
    </>
  );
};
