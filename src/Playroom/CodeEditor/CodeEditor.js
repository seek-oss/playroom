import React, { useState, useRef, useEffect } from 'react';
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
import EditorUndockedSvg from '../../assets/icons/EditorUndockedSvg';
import EditorLeftSvg from '../../assets/icons/EditorLeftSvg';
import EditorBottomSvg from '../../assets/icons/EditorBottomSvg';
import EditorRightSvg from '../../assets/icons/EditorRightSvg';
import AddSvg from '../../assets/icons/AddSvg';
import PatternLibrary from './PatternLibrary/PatternLibrary';

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

const validateCode = ({ editor, code, highlightErrors }) => {
  try {
    compileJsx(code);
    return true;
  } catch (err) {
    if (highlightErrors) {
      const errorMessage = err && (err.message || '');
      const matches = errorMessage.match(/\(([0-9]+):/);
      const lineNumber =
        matches &&
        matches.length >= 2 &&
        matches[1] &&
        parseInt(matches[1], 10);

      if (lineNumber) {
        const marker = document.createElement('div');
        marker.classList.add(styles.marker);
        marker.setAttribute('title', err.message);
        editor.setGutterMarker(lineNumber - 1, styles.gutter, marker);
      }
    }

    return false;
  }
};

const formatCode = ({ code, cm, cursor }) => {
  const { formattedCode, line, ch } = format({
    code,
    cursor: cursor || cm.getCursor()
  });
  cm.setValue(formattedCode);
  cm.focus();
  cm.setCursor({
    line,
    ch
  });

  return formattedCode;
};

const isValidLocation = ({ editor, code }) => {
  const { line, ch } = editor.getCursor();
  const testCode = code.split('\n');
  testCode[line] = `${testCode[line].slice(0, ch)}<b>"b"</b>${testCode[
    line
  ].slice(ch)}`;

  return validateCode({ code: testCode.join('\n') });
};

export const CodeEditor = ({
  code,
  patterns,
  onChange,
  hints,
  onEditorPositionChange,
  editorPosition,
  onPreviewCode
}) => {
  const editorInstanceRef = useRef(null);
  const [showPatterns, setShowPatterns] = useState(false);
  const [validInsertLocation, setValidInsertLocation] = useState(false);

  useEffect(() => {
    const handleKeyDown = event => {
      if (editorInstanceRef && editorInstanceRef.current) {
        const { key } = event;
        const cmdOrCtrlKey = navigator.platform.match('Mac')
          ? event.metaKey
          : event.ctrlKey;

        if (cmdOrCtrlKey && (key === 'p' || key === 'i')) {
          event.preventDefault();
          setShowPatterns(true);
        } else if (cmdOrCtrlKey && key === 's') {
          event.preventDefault();
          onChange(
            formatCode({
              code,
              cm: editorInstanceRef.current
            })
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [code, onChange]);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div className={styles.toolbar}>
        <button
          className={styles.addButton}
          onClick={() => setShowPatterns(true)}
          disabled={!validInsertLocation}
          title={
            validInsertLocation
              ? `Add from pattern library (${
                  navigator.platform.match('Mac') ? '\u2318' : 'ctrl + '
                }P)`
              : 'Cursor must be in valid location to insert from pattern library'
          }
        >
          <AddSvg />
        </button>
        <div className={styles.dockPosition}>
          <div className={styles.activePosition}>
            {
              {
                undocked: <EditorUndockedSvg />,
                left: <EditorLeftSvg />,
                right: <EditorRightSvg />,
                bottom: <EditorBottomSvg />
              }[editorPosition]
            }
          </div>
          <div className={styles.options}>
            {editorPosition !== 'undocked' && (
              <button
                title="Undock editor"
                className={styles.toolbarIcon}
                onClick={() => onEditorPositionChange('undocked')}
              >
                <EditorUndockedSvg />
              </button>
            )}
            {editorPosition !== 'left' && (
              <button
                title="Dock editor to the left"
                className={styles.toolbarIcon}
                onClick={() => onEditorPositionChange('left')}
              >
                <EditorLeftSvg />
              </button>
            )}
            {editorPosition !== 'right' && (
              <button
                title="Dock editor to the right"
                className={styles.toolbarIcon}
                onClick={() => onEditorPositionChange('right')}
              >
                <EditorRightSvg />
              </button>
            )}
            {editorPosition !== 'bottom' && (
              <button
                title="Dock editor to the bottom"
                className={styles.toolbarIcon}
                onClick={() => onEditorPositionChange('bottom')}
              >
                <EditorBottomSvg />
              </button>
            )}
          </div>
        </div>
      </div>
      {showPatterns && patterns && patterns.length ? (
        <div
          style={{
            background: 'white',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            zIndex: 100
          }}
        >
          <PatternLibrary
            patterns={patterns}
            onHighlight={item => {
              if (!item) {
                onPreviewCode(null);
                return;
              }

              const cm = editorInstanceRef.current;

              const { line, ch } = cm.getCursor();
              const newCode = code.split('\n');
              newCode[line] = `${newCode[line].slice(0, ch)}${
                item.code
              }${newCode[line].slice(ch)}`;

              onPreviewCode(newCode.join('\n'));
            }}
            onSelected={item => {
              const cm = editorInstanceRef.current;
              const cursor = cm.getCursor();

              const { line, ch } = cursor;

              const snippetLines = item.code.split('\n');
              const lastSnippetLine = snippetLines[snippetLines.length - 1];

              const newCursor =
                snippetLines.length === 1
                  ? { line, ch: ch + lastSnippetLine.length }
                  : {
                      line: line + snippetLines.length - 1,
                      ch: lastSnippetLine.length
                    };

              const newCode = code.split('\n');
              newCode[line] = `${newCode[line].slice(0, ch)}${
                item.code
              }${newCode[line].slice(ch)}`;

              setTimeout(() => {
                onPreviewCode(null);
                onChange(
                  formatCode({
                    cm,
                    cursor: newCursor,
                    code: newCode.join('\n')
                  })
                );
              }, 0);
            }}
            onExit={() => {
              setShowPatterns(false);
              editorInstanceRef.current.focus();
            }}
          />
        </div>
      ) : null}
      <ReactCodeMirror
        editorDidMount={editor => {
          setValidInsertLocation(
            isValidLocation({
              editor,
              code: editor.getValue()
            })
          );
          editorInstanceRef.current = editor;
          editorInstanceRef.current.focus();
          editorInstanceRef.current.setCursor({ line: 0, ch: 0 });
        }}
        value={code}
        onBeforeChange={(editor, data, newCode) => {
          editor.clearGutter(styles.gutter);
          onChange(newCode);
          validateCode({
            code: newCode,
            highlightErrors: true,
            editor
          });

          setValidInsertLocation(isValidLocation({ editor, code: newCode }));
        }}
        onCursorActivity={editor => {
          setValidInsertLocation(
            isValidLocation({ editor, code: editor.getValue() })
          );
        }}
        options={{
          mode: 'jsx',
          autoCloseTags: true,
          autoCloseBrackets: true,
          theme: 'neo',
          lineNumbers: true,
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
    </div>
  );
};
