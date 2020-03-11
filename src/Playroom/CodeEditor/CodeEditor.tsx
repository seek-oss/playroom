import React, { useRef, useContext, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Editor } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

import { StoreContext, CursorPosition } from '../../StoreContext/StoreContext';
import { formatCode as format } from '../../utils/formatting';
import { compileJsx } from '../../utils/compileJsx';

// @ts-ignore
import styles from './CodeEditor.less';

import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';

const completeAfter = (cm: Editor, predicate: () => boolean) => {
  const CodeMirror = cm.constructor;
  if (!predicate || predicate()) {
    setTimeout(() => {
      if (!cm.state.completionActive) {
        // @ts-ignore
        cm.showHint({ completeSingle: false });
      }
    }, 100);
  }

  // @ts-ignore
  return CodeMirror.Pass;
};

const completeIfAfterLt = (cm: Editor) => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const cur = cm.getCursor();
    // @ts-ignore
    // eslint-disable-next-line new-cap
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });
};

const completeIfInTag = (cm: Editor) => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const tok = cm.getTokenAt(cm.getCursor());
    if (
      tok.type === 'string' &&
      (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
        tok.string.length === 1)
    ) {
      return false;
    }
    // @ts-ignore
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
};

const validateCode = (editorInstance: Editor, code: string) => {
  editorInstance.clearGutter(styles.gutter);

  try {
    compileJsx(code);
  } catch (err) {
    const errorMessage = err && (err.message || '');
    const matches = errorMessage.match(/\(([0-9]+):/);
    const lineNumber =
      matches && matches.length >= 2 && matches[1] && parseInt(matches[1], 10);

    if (lineNumber) {
      const marker = document.createElement('div');
      marker.classList.add(styles.marker);
      marker.setAttribute('title', err.message);
      editorInstance.setGutterMarker(lineNumber - 1, styles.gutter, marker);
    }
  }
};

interface Hint {
  attrs: Record<string, any>;
}

interface Props {
  code: string;
  onChange: (code: string) => void;
  previewCode?: string;
  hints?: Record<string, Hint>;
}

export const CodeEditor = ({ code, onChange, previewCode, hints }: Props) => {
  const editorInstanceRef = useRef<Editor | null>(null);
  const insertionPointRef = useRef<ReturnType<Editor['addLineClass']> | null>(
    null
  );
  const [{ cursorPosition, highlightLineNumber }, dispatch] = useContext(
    StoreContext
  );

  const [debouncedChange] = useDebouncedCallback(
    newCode => onChange(newCode),
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
        const cmdOrCtrl = navigator.platform.match('Mac')
          ? e.metaKey
          : e.ctrlKey;

        if (cmdOrCtrl && e.keyCode === 83) {
          e.preventDefault();
          const { code: formattedCode, cursor: formattedCursor } = format({
            code: editorInstanceRef.current.getValue(),
            cursor: editorInstanceRef.current.getCursor()
          });

          editorInstanceRef.current.setValue(formattedCode);
          editorInstanceRef.current.setCursor(formattedCursor);
        }

        if (cmdOrCtrl && /^[k]$/.test(e.key)) {
          e.preventDefault();
          dispatch({ type: 'toggleToolbar', payload: { panel: 'snippets' } });
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
        editorInstanceRef.current.hasFocus() ||
        code === editorInstanceRef.current.getValue() ||
        previewCode
      ) {
        return;
      }

      editorInstanceRef.current.setValue(code);
      validateCode(editorInstanceRef.current, code);
    }
  }, [code, previewCode]);

  useEffect(() => {
    if (editorInstanceRef.current && !editorInstanceRef.current.hasFocus()) {
      setCursorPosition(cursorPosition);
    }
  }, [cursorPosition, setCursorPosition]);

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
            ch: 0
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

  return (
    <ReactCodeMirror
      editorDidMount={editorInstance => {
        editorInstanceRef.current = editorInstance;
        validateCode(editorInstance, code);
        setCursorPosition(cursorPosition);
      }}
      onChange={(editorInstance, data, newCode) => {
        if (editorInstance.hasFocus() && !previewCode) {
          validateCode(editorInstance, newCode);
          debouncedChange(newCode);
        }
      }}
      onCursorActivity={editor => {
        setTimeout(() => {
          if (!editor.somethingSelected() && editor.hasFocus()) {
            const { line, ch } = editor.getCursor();

            dispatch({
              type: 'updateCursorPosition',
              payload: { position: { line, ch } }
            });
          }
        });
      }}
      // @ts-ignore
      options={{
        mode: 'jsx',
        autoCloseTags: true,
        autoCloseBrackets: true,
        theme: 'neo',
        gutters: [styles.gutter],
        hintOptions: { schemaInfo: hints },
        viewportMargin: 50,
        extraKeys: {
          Tab: cm => {
            if (cm.somethingSelected()) {
              // @ts-ignore
              cm.indentSelection('add');
            } else {
              const indent = cm.getOption('indentUnit') as number;
              const spaces = Array(indent + 1).join(' ');
              cm.replaceSelection(spaces);
            }
          },
          "'<'": completeAfter,
          "'/'": completeIfAfterLt,
          "' '": completeIfInTag,
          "'='": completeIfInTag
        }
      }}
    />
  );
};
