import React, { useRef, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';

import { formatCode } from '../../utils/formatting';

// import styles from './CodeEditor.less';

import { Controlled as ReactCodeMirror } from 'react-codemirror2';

import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babylon';
import compileJsx from '../../utils/compileJsx';

const validateCode = (editorInstanceRef, code) => {
  // editorInstanceRef.clearGutter(styles.gutter);

  try {
    compileJsx(code);
  } catch (err) {
    const errorMessage = err && (err.message || '');
    const matches = errorMessage.match(/\(([0-9]+):/);
    const lineNumber =
      matches && matches.length >= 2 && matches[1] && parseInt(matches[1], 10);

    if (lineNumber) {
      const marker = document.createElement('div');
      // marker.classList.add(styles.marker);
      marker.setAttribute('title', err.message);
      // editorInstanceRef.setGutterMarker(lineNumber - 1, styles.gutter, marker);
    }
  }
};

export const CodeEditor = ({ code, onChange, hints }) => {
  return (
    <MonacoEditor
      language="javascript"
      theme="vs-light"
      value={code}
      options={{
        minimap: { enabled: false },
        contextmenu: false,
        lineHeight: 23,
        fontSize: 16,
        renderLineHighlight: 'none',
        automaticLayout: true, // consider perf?
        scrollBeyondLastLine: false,
        selectionHighlight: false,
        occurrencesHighlight: false,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        formatOnPaste: true,
        formatOnType: true
      }}
      onChange={onChange}
      editorWillMount={monaco => {
        monaco.languages.registerDocumentFormattingEditProvider('javascript', {
          provideDocumentFormattingEdits(model, options, token) {
            let text;
            try {
              text = prettier.format(model.getValue(), {
                parser: 'babylon',
                plugins: [babylon],
                singleQuote: true
              });
            } catch (e) {
              return null;
            }

            return [
              {
                range: model.getFullModelRange(),
                text
              }
            ];
          }
        });
      }}
      editorDidMount={(editor, monaco) => {
        editor.addCommand(
          monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
          () => editor.getAction('editor.action.formatDocument').run()
        );
      }}
    />
  );
};
