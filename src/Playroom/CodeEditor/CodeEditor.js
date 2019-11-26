import React, { useRef, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

import { formatCode as format } from '../../utils/formatting';

import styles from './CodeEditor.less';

import { Controlled as ReactCodeMirror } from 'react-codemirror2';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';
import compileJsx from '../../utils/compileJsx';

const completeAfter = (cm, predicate) => {
  const CodeMirror = cm.constructor;
  if (!predicate || predicate()) {
    setTimeout(() => {
      if (!cm.state.completionActive) {
        cm.showHint({ completeSingle: false });
      }
    }, 100);
  }

  return CodeMirror.Pass;
};

const completeIfAfterLt = cm => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const cur = cm.getCursor();
    // eslint-disable-next-line new-cap
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });
};

const completeIfInTag = cm => {
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
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
};

const validateCode = (editorInstanceRef, code) => {
  editorInstanceRef.clearGutter(styles.gutter);

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
      editorInstanceRef.setGutterMarker(lineNumber - 1, styles.gutter, marker);
    }
  }
};

export const CodeEditor = ({ code, onChange, hints }) => {
  const editorInstanceRef = useRef(null);

  useEffect(
    () => {
      const handleKeyDown = e => {
        if (
          editorInstanceRef &&
          editorInstanceRef.current &&
          e.keyCode === 83 &&
          (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
        ) {
          e.preventDefault();

          const { formattedCode, line, ch } = format({
            code,
            cursor: editorInstanceRef.current.getCursor()
          });

          onChange(formattedCode);
          editorInstanceRef.current.setValue(formattedCode);
          editorInstanceRef.current.focus();
          editorInstanceRef.current.setCursor({
            line,
            ch
          });
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [code, onChange]
  );

  return (
    <ReactCodeMirror
      editorDidMount={editorInstance => {
        editorInstanceRef.current = editorInstance;
        editorInstanceRef.current.focus();
        editorInstanceRef.current.setCursor({ line: 0, ch: 0 });
      }}
      value={code}
      onBeforeChange={(editor, data, newCode) => {
        onChange(newCode);
        validateCode(editorInstanceRef.current, newCode);
      }}
      options={{
        mode: 'jsx',
        autoCloseTags: true,
        autoCloseBrackets: true,
        theme: 'neo',
        gutters: [styles.gutter],
        hintOptions: { schemaInfo: hints },
        extraKeys: {
          Tab: cm => {
            if (cm.somethingSelected()) {
              cm.indentSelection('add');
            } else {
              const indent = cm.getOption('indentUnit');
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
