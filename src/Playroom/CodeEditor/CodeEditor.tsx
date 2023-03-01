import React, { useRef, useContext, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import CodeMirror, { Editor, Pos } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

import { StoreContext, CursorPosition } from '../../StoreContext/StoreContext';
import { formatCode as format } from '../../utils/formatting';
import {
  closeFragmentTag,
  compileJsx,
  openFragmentTag,
} from '../../utils/compileJsx';

import * as styles from './CodeEditor.css';

import { UnControlled as ReactCodeMirror } from './CodeMirror2';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

const directionToMethod = {
  up: 'to',
  down: 'from',
} as const;

type DuplicationDirection = keyof typeof directionToMethod;

const getNewPosition = (
  range: CodeMirror.Range,
  direction: DuplicationDirection
) => {
  const currentLine = range[directionToMethod[direction]]().line;

  const newLine = direction === 'up' ? currentLine + 1 : currentLine;
  return new Pos(newLine, 0);
};

const duplicateLine = (direction: DuplicationDirection) => (cm: Editor) =>
  cm.operation(function () {
    const ranges = cm.listSelections();

    if (ranges.length > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        "The duplicate line command doesn't support multiple cursors yet. Please ask for this feature."
      );
    }

    const range = ranges[0];

    const existingContent = cm.getRange(
      new Pos(range.from().line, 0),
      new Pos(range.to().line)
    );

    const newContentParts = [existingContent, '\n'];

    // Copy up on the last line has some unusual behaviour
    if (range.to().line === cm.lastLine() && direction === 'up') {
      newContentParts.reverse();
    }

    const newContent = newContentParts.join('');

    cm.replaceRange(newContent, getNewPosition(range, direction));

    // Copy up doesn't always handle its cursors correctly
    if (direction === 'up') {
      cm.setSelection(range.anchor, range.head);
    }

    cm.scrollIntoView(null);
  });

const swapLineUp = (cm: Editor) => {
  if (cm.isReadOnly()) {
    return CodeMirror.Pass;
  }

  const ranges = cm.listSelections();

  if (ranges.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      "The swap line command doesn't support multiple cursors yet. Please ask for this feature."
    );
  }

  const range = ranges[0];

  // If we're already at the top, do nothing
  if (range.from().line > 0) {
    const switchLineNumber = range.from().line - 1;
    const switchLineContent = cm.getLine(switchLineNumber);

    // Expand to the end of the selected lines
    const rangeStart = new Pos(range.from().line, 0);
    const rangeEnd = new Pos(range.to().line, undefined);

    const rangeContent = cm.getRange(rangeStart, rangeEnd);

    cm.operation(() => {
      // Switch the order of the range and the preceding line
      const newContent = [rangeContent, switchLineContent].join('\n');

      cm.replaceRange(
        newContent,
        new Pos(switchLineNumber, 0),
        rangeEnd,
        '+swapLine'
      );

      // Shift the selection up by one line to match the moved content
      cm.setSelection(
        new Pos(range.anchor.line - 1, range.anchor.ch),
        new Pos(range.head.line - 1, range.head.ch)
      );
    });
  }
};

const swapLineDown = (cm: Editor) => {
  if (cm.isReadOnly()) {
    return CodeMirror.Pass;
  }

  const ranges = cm.listSelections();

  if (ranges.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      "The swap line command doesn't support multiple cursors yet. Please ask for this feature."
    );
  }

  const range = ranges[0];

  // If we're already at the bottom, do nothing
  if (range.to().line < cm.lastLine()) {
    const switchLineNumber = range.to().line + 1;
    const switchLineContent = cm.getLine(switchLineNumber);

    // Expand to the end of the selected lines
    const rangeStart = new Pos(range.from().line, 0);
    const rangeEnd = new Pos(range.to().line, undefined);

    const rangeContent = cm.getRange(rangeStart, rangeEnd);

    cm.operation(() => {
      // Switch the order of the range and the preceding line
      const newContent = [switchLineContent, rangeContent].join('\n');

      cm.replaceRange(
        newContent,
        rangeStart,
        new Pos(switchLineNumber),
        '+swapLine'
      );

      // Shift the selection down by one line to match the moved content
      cm.setSelection(
        new Pos(range.anchor.line + 1, range.anchor.ch),
        new Pos(range.head.line + 1, range.head.ch)
      );
    });
  }
};

const completeAfter = (cm: Editor, predicate?: () => boolean) => {
  if (!predicate || predicate()) {
    setTimeout(() => {
      if (!cm.state.completionActive) {
        cm.showHint({ completeSingle: false });
      }
    }, 100);
  }

  return CodeMirror.Pass;
};

const completeIfAfterLt = (cm: Editor) =>
  completeAfter(cm, () => {
    const cur = cm.getCursor();
    // eslint-disable-next-line new-cap
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });

const completeIfInTag = (cm: Editor) =>
  completeAfter(cm, () => {
    const tok = cm.getTokenAt(cm.getCursor());
    if (
      tok.type === 'string' &&
      (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
        tok.string.length === 1)
    ) {
      return false;
    }
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });

const validateCode = (editorInstance: Editor, code: string) => {
  editorInstance.clearGutter('errorGutter');

  try {
    compileJsx(code);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '';
    const matches = errorMessage.match(/\(([0-9]+):/);
    const lineNumber =
      matches && matches.length >= 2 && matches[1] && parseInt(matches[1], 10);

    if (lineNumber) {
      // Remove our wrapping Fragment from error message
      const openWrapperStartIndex = errorMessage.indexOf(openFragmentTag);
      const closeWrapperStartIndex = errorMessage.lastIndexOf(closeFragmentTag);
      const formattedMessage = [
        errorMessage.slice(0, openWrapperStartIndex),
        errorMessage.slice(
          openWrapperStartIndex + openFragmentTag.length,
          closeWrapperStartIndex
        ),
        errorMessage.slice(closeWrapperStartIndex + closeFragmentTag.length),
      ].join('');

      const marker = document.createElement('div');
      marker.setAttribute('class', styles.errorMarker);
      marker.setAttribute('title', formattedMessage);
      marker.innerText = String(lineNumber);
      editorInstance.setGutterMarker(lineNumber - 1, 'errorGutter', marker);
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
        const cmdOrCtrl = navigator.platform.match('Mac')
          ? e.metaKey
          : e.ctrlKey;

        if (cmdOrCtrl && e.keyCode === 83) {
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

  return (
    <ReactCodeMirror
      editorDidMount={(editorInstance) => {
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
        },
      }}
    />
  );
};
