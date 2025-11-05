import type { Doc, Editor } from 'codemirror';
import { useRef, useContext, useEffect, type Dispatch, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/theme/neo.css';

import { useEditor } from '../../contexts/EditorContext';
import { type Action, StoreContext } from '../../contexts/StoreContext';
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

const positionErrorMarkerAtCursor = (
  cursorMarker: HTMLButtonElement,
  editor: Editor
) => {
  const cursorPos = editor.cursorCoords(true, 'local');
  const scrollOffset = editor.getScrollInfo();
  const gutterWidth = editor.getGutterElement().getBoundingClientRect().width;
  cursorMarker.style.top = `${cursorPos.top - scrollOffset.top}px`;
  cursorMarker.style.left = `${
    cursorPos.left + gutterWidth - scrollOffset.left
  }px`;
  cursorMarker.style.height = `${cursorPos.bottom - cursorPos.top}px`;
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
  const cursorErrorMarkerRef = useRef<HTMLButtonElement | null>(null);
  const invalidSnippetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const errorGutterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [invalidSnippetLocation, setInvalidSnippetLocation] = useState(false);
  const editorInstanceRef = useRef<Editor | null>(null);
  const editorDocRef = useRef<Doc | null>(null);
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
            positionErrorMarkerAtCursor(
              cursorErrorMarkerRef.current,
              editorInstanceRef.current
            );
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

    // Entering snippets preview mode
    if (previewCode) {
      editorDocRef.current = editorInstanceRef.current.getDoc();
      const previewDoc = editorDocRef.current.copy(false);
      previewDoc.setValue(previewCode);
      editorInstanceRef.current.swapDoc(previewDoc);
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
    }

    return () => {
      // Exiting snippets preview mode
      if (previewCode && editorDocRef.current) {
        editorInstanceRef.current?.swapDoc(editorDocRef.current);
        editorDocRef.current = null;
      }
      if (insertionPointRef.current) {
        editorInstanceRef.current?.removeLineClass(
          insertionPointRef.current,
          'background'
        );
        insertionPointRef.current = null;
      }
      if (typeof highlightLineNumber === 'number') {
        editorInstanceRef.current?.focus();
      }
    };
  }, [previewCode, highlightLineNumber]);

  useEffect(() => {
    if (
      !editorInstanceRef.current ||
      code === editorInstanceRef.current.getValue()
    ) {
      return;
    }

    editorInstanceRef.current.setValue(code);
    editorInstanceRef.current.setCursor(cursorPosition.line, cursorPosition.ch);

    validateCodeInEditor(editorInstanceRef.current, code, dispatch);
  }, [code, cursorPosition, dispatch]);

  return (
    <>
      <ReactCodeMirror
        editorDidMount={(editorInstance) => {
          editorInstanceRef.current = editorInstance;
          editorInstanceRef.current.setValue(code);
          validateCodeInEditor(editorInstance, code, dispatch);
          if (!editorHidden) {
            editorInstanceRef.current.focus();
            editorInstanceRef.current.setCursor(
              cursorPosition.line,
              cursorPosition.ch
            );
          }
          registerEditor(editorInstance);
        }}
        onChange={(editorInstance, data, newCode) => {
          if (previewCode) {
            return;
          }

          if (editorInstance.hasFocus()) {
            validateCodeInEditor(editorInstance, newCode, dispatch);
            onChange(newCode);
          }
        }}
        onCursorActivity={(editor) => {
          if (previewCode) {
            return;
          }

          setInvalidSnippetLocation(false);

          if (!editor.somethingSelected()) {
            const { line, ch } = editor.getCursor();

            dispatch({
              type: 'updateCursorPosition',
              payload: {
                position: { line, ch },
                code: editor.getValue(),
              },
            });
          }
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
