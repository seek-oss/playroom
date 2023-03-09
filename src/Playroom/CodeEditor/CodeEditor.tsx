import React, { useRef, useContext, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Editor } from 'codemirror';
import mapValues from 'lodash/mapValues';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

import {
  StoreContext,
  StoreContextValues,
  CursorPosition,
} from '../../StoreContext/StoreContext';
import { formatCode as format, isMac } from '../../utils/formatting';
import {
  closeFragmentTag,
  compileJsx,
  openFragmentTag,
} from '../../utils/compileJsx';

import * as styles from './CodeEditor.css';

import { UnControlled as ReactCodeMirror } from './CodeMirror2';
import {
  completeAfter,
  completeIfAfterLt,
  completeIfInTag,
} from './keymaps/complete';
import { duplicateLine, swapLineDown, swapLineUp } from './keymaps/lines';

import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import {
  addCursorToNextLine,
  addCursorToPrevLine,
  selectNextOccurrence,
} from './keymaps/cursors';
import { wrapInTag } from './keymaps/wrap';

type Keymap = Record<
  string,
  {
    handler: (cm: Editor, dispatch: StoreContextValues[1]) => unknown;
    description: string;
  }
>;

const keymapModifierKey = isMac() ? 'Cmd' : 'Ctrl';

const ownKeymap = {
  [`${keymapModifierKey}-K`]: {
    handler: (cm, dispatch) => {
      dispatch({ type: 'toggleToolbar', payload: { panel: 'snippets' } });
    },
    description: 'Toggle toolbar',
  },
  [`${keymapModifierKey}-S`]: {
    handler: (cm, dispatch) => {
      const { code: formattedCode, cursor: formattedCursor } = format({
        code: cm.getValue(),
        cursor: cm.getCursor(),
      });

      dispatch({
        type: 'updateCode',
        payload: { code: formattedCode, cursor: formattedCursor },
      });
      cm.setValue(formattedCode);
      cm.setCursor(formattedCursor);
    },
    description: 'Format code',
  },
} satisfies Keymap;

const codeMirrorKeymap = {
  'Alt-Up': {
    handler: swapLineUp,
    description: 'Swap line up',
  },
  'Alt-Down': {
    handler: swapLineDown,
    description: 'Swap line down',
  },
  'Shift-Alt-Up': {
    handler: duplicateLine('up'),
    description: 'Duplicate line up',
  },
  'Shift-Alt-Down': {
    handler: duplicateLine('down'),
    description: 'Duplicate line down',
  },
  [`${keymapModifierKey}-Alt-Up`]: {
    handler: addCursorToPrevLine,
    description: 'Add cursor to prev line',
  },
  [`${keymapModifierKey}-Alt-Down`]: {
    handler: addCursorToNextLine,
    description: 'Add cursor to next line',
  },
  [`${keymapModifierKey}-D`]: {
    handler: selectNextOccurrence,
    description: 'Select next occurrence',
  },
  [`Shift-${keymapModifierKey}-,`]: {
    handler: wrapInTag,
    description: 'Wrap selection in tag',
  },
} satisfies Keymap;

export const keymap = {
  ...ownKeymap,
  ...codeMirrorKeymap,
};

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
        const cmdOrCtrl = isMac() ? e.metaKey : e.ctrlKey;

        if (cmdOrCtrl && e.key === 'S'.toLowerCase()) {
          e.preventDefault();
          keymap[`${keymapModifierKey}-S`].handler(
            editorInstanceRef.current,
            dispatch
          );
        }

        if (cmdOrCtrl && e.key === 'K'.toLowerCase()) {
          e.preventDefault();
          keymap[`${keymapModifierKey}-K`].handler(
            editorInstanceRef.current,
            dispatch
          );
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
          ...mapValues(codeMirrorKeymap, (value) => value.handler),
        },
      }}
    />
  );
};
