import React, {
  ComponentProps,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
// import { Editor } from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/neo.css';
import { HTMLWorker } from 'monaco-editor/esm/vs/language/html/htmlWorker';
import hints from './hints.json';
import { StoreContext, CursorPosition } from '../../StoreContext/StoreContext';
import { formatCode as format } from '../../utils/formatting';
import { compileJsx } from '../../utils/compileJsx';

import MonacoEditor from 'react-monaco-editor';
// @ts-ignore
// import styles from './CodeEditor.less';

// import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
// import 'codemirror/mode/jsx/jsx';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/hint/show-hint';
// import 'codemirror/addon/hint/xml-hint';

// const completeAfter = (cm: Editor, predicate: () => boolean) => {
//   const CodeMirror = cm.constructor;
//   if (!predicate || predicate()) {
//     setTimeout(() => {
//       if (!cm.state.completionActive) {
//         // @ts-ignore
//         cm.showHint({ completeSingle: false });
//       }
//     }, 100);
//   }

//   // @ts-ignore
//   return CodeMirror.Pass;
// };

// const completeIfAfterLt = (cm: Editor) => {
//   const CodeMirror = cm.constructor;

//   return completeAfter(cm, () => {
//     const cur = cm.getCursor();
//     // @ts-ignore
//     // eslint-disable-next-line new-cap
//     return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
//   });
// };

// const completeIfInTag = (cm: Editor) => {
//   const CodeMirror = cm.constructor;

//   return completeAfter(cm, () => {
//     const tok = cm.getTokenAt(cm.getCursor());
//     if (
//       tok.type === 'string' &&
//       (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
//         tok.string.length === 1)
//     ) {
//       return false;
//     }
//     // @ts-ignore
//     const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
//     return inner.tagName;
//   });
// };

const validateCode = (code?: string) => {
  if (!code) {
    return;
  }
  // editorInstance.clearGutter(styles.gutter);

  try {
    compileJsx(code);
  } catch (err) {
    // const errorMessage = err && (err.message || '');
    // const matches = errorMessage.match(/\(([0-9]+):/);
    // const lineNumber =
    //   matches && matches.length >= 2 && matches[1] && parseInt(matches[1], 10);
    console.error(err);

    // if (lineNumber) {
    //   const marker = document.createElement('div');
    //   marker.classList.add(styles.marker);
    //   marker.setAttribute('title', err.message);
    //   editorInstance.setGutterMarker(lineNumber - 1, styles.gutter, marker);
    // }
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

const options = {
  language: 'html',
  minimap: { enabled: false },
  useDefaultDataProvider: false,
  lineHeight: 23,
  fontSize: 16,
  renderLineHighlight: 'none',
  scrollBeyondLastLine: false,
  selectionHighlight: false,
  occurrencesHighlight: false,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  renderIndentGuides: true,
  wordBasedSuggestions: false,
  suggestLineHeight: 36,
  automaticLayout: true, // perf hit?
  suggest: {
    filteredTypes: {
      class: false,
      color: false,
      constant: false,
      constructor: false,
      customcolor: false,
      enum: false,
      enummember: false,
      event: false,
      field: true,
      file: false,
      folder: false,
      function: true,
      interface: false,
      keyword: false,
      method: false,
      module: false,
      operator: false,
      property: true,
      reference: false,
      snippet: true,
      struct: false,
      text: true,
      typeparameter: false,
      unit: false,
      value: false,
      variable: false,
    },
  },
  // lineNumbers: (n) => `${n - 1}`,
} as ComponentProps<typeof MonacoEditor>['options'];

const configureMonacoInstance = (monaco) => {
  monaco.editor.defineTheme('playroom', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: '', foreground: '2e383c' },
      { token: 'tag', foreground: '040080' },
      { token: 'delimiter.html', foreground: '040080' },
      { token: 'attribute.name', foreground: '005ad2' },
      { token: 'attribute.value', foreground: '00439c' },
    ],
    colors: {
      'editorIndentGuide.background': '#ffffff',
      'editorIndentGuide.activeBackground': '#d5d5d5',
      'editorSuggestWidget.selectedBackground': '#08f',
      'editorSuggestWidget.highlightForeground': '#000',
    },
  });

  monaco.editor.setTheme('playroom');

  type MonacoModel = ReturnType<typeof monaco.editor.getModel>;
  type MonacoPosition = ReturnType<typeof monaco.editor.getPosition>;

  const getTextUntilPosition = (
    model: MonacoModel,
    position: MonacoPosition
  ) => {
    const textLineUntilPosition = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });

    return textLineUntilPosition.trim().length === 0 ||
      textLineUntilPosition.indexOf('<') === -1
      ? model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })
      : textLineUntilPosition;
  };

  // Component name autocomplete
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['<'],
    provideCompletionItems(model: MonacoModel, position: MonacoPosition) {
      const textUntilPosition = getTextUntilPosition(model, position);
      const lastLine = model.getLineCount();
      const textAfterPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: lastLine,
        endColumn: model.getLineLength(lastLine),
      });

      if (
        !/<\s*$/.test(textUntilPosition) ||
        /^\s*\//.test(textAfterPosition)
      ) {
        return { suggestions: [] };
      }

      return {
        suggestions: Object.keys(hints).map((component) => ({
          label: `${component}`,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: component,
        })),
      };
    },
  });

  // Prop name autocomplete
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: [' '],
    provideCompletionItems(model: MonacoModel, position: MonacoPosition) {
      const textUntilPosition = getTextUntilPosition(model, position);
      const currentTagToCursor = textUntilPosition.slice(
        textUntilPosition.lastIndexOf('<')
      );

      if (currentTagToCursor.indexOf('>') > -1) {
        return { suggestions: [] };
      }

      const openTagName = currentTagToCursor.match(/^<\s*(\w+)/)?.[1];
      const isCursorInsidePropValue = /\=\s*["']?$/.test(currentTagToCursor);

      if (isCursorInsidePropValue || !(openTagName && openTagName in hints)) {
        return { suggestions: [] };
      }

      return {
        suggestions: Object.keys(hints[openTagName].attrs).map((prop) => ({
          label: prop,
          kind: monaco.languages.CompletionItemKind.Field,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          insertText: /\s+$/.test(textUntilPosition) ? prop : ` ${prop}`,
        })),
      };
    },
  });

  // Prop value autocomplete
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['='],
    provideCompletionItems(model: MonacoModel, position: MonacoPosition) {
      const textUntilPosition = getTextUntilPosition(model, position);
      const propName = textUntilPosition.match(/(\w+)\s*\=\s*["']?\s*$/)?.[1];
      const currentTagToCursor = textUntilPosition.slice(
        textUntilPosition.lastIndexOf('<')
      );

      if (currentTagToCursor.indexOf('>') > -1) {
        return { suggestions: [] };
      }

      const openTagName = currentTagToCursor.match(/^<\s*(\w+)/)?.[1];

      if (
        !(
          openTagName &&
          openTagName in hints &&
          propName in hints[openTagName].attrs
        )
      ) {
        return { suggestions: [] };
      }

      const lastLine = model.getLineCount();
      const textAfterPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: lastLine,
        endColumn: model.getLineLength(lastLine),
      });
      const quoteBefore = /[=]\s*"\s*$/.test(textUntilPosition) ? '' : '"';
      const quoteAfter = /^\s*"/.test(textAfterPosition) ? '' : '"';

      return {
        suggestions: hints[openTagName].attrs[propName].map((value) => ({
          label: value,
          kind: monaco.languages.CompletionItemKind.Text,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          insertText: `${quoteBefore}${value}${quoteAfter}$0`,
        })),
      };
    },
  });

  // Component close tag autocomplete
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['>'],
    provideCompletionItems(model: MonacoModel, position: MonacoPosition) {
      const textUntilPosition = getTextUntilPosition(model, position);
      const openTag = textUntilPosition.match(/.*<(\w+).*>$/)?.[1];

      if (!openTag) {
        return { suggestions: [] };
      }

      return {
        suggestions: [
          {
            label: ` </${openTag}>`,
            kind: monaco.languages.CompletionItemKind.Field,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: `$0</${openTag}>`,
          },
        ],
      };
    },
  });
};

export const CodeEditor = ({ code, onChange, previewCode, hints }: Props) => {
  const [{ cursorPosition, highlightLineNumber }, dispatch] = useContext(
    StoreContext
  );

  const updateCursorPosition = ({
    position,
    currentCode,
  }: {
    position: CursorPosition;
    currentCode: string | undefined;
  }) => {
    dispatch({
      type: 'updateCursorPosition',
      payload: {
        position,
        code: currentCode,
      },
    });
  };

  return (
    <MonacoEditor
      language="javascript"
      value={code}
      onChange={onChange}
      options={options}
      editorWillMount={configureMonacoInstance}
      editorDidMount={(editor, monaco) => {
        // validateCode(editor.getModel()?.getValue());

        // editor.onDidChangeCursorPosition(({ position, secondaryPositions }) => {
        //   const isNotMultiCursor = secondaryPositions.length === 0;
        //   if (
        //     editor.getSelection()?.isEmpty() &&
        //     isNotMultiCursor &&
        //     editor.hasTextFocus()
        //   ) {
        //     updateCursorPosition({
        //       position: { line: position.lineNumber, ch: position.column },
        //       currentCode: editor.getModel()?.getValue(),
        //     });
        //   }
        // });

        // updateCursorPosition({
        //   position: {
        //     line: editor.getPosition()?.lineNumber || 0,
        //     ch: editor.getPosition()?.column || 0,
        //   },
        //   currentCode: editor.getModel()?.getValue(),
        // });

        // editorDidMount={::this.editorDidMount}
        editor.addCommand(
          monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
          () => editor.getAction('editor.action.formatDocument').run()
        );

        // const model = editor.getModel();
        // if (model) {
        //   const lastLine = model.getLineCount();
        //   // @ts-expect-error
        //   editor.setHiddenAreas([
        //     {
        //       startLineNumber: 1,
        //       endLineNumber: 1,
        //     },
        //     {
        //       startLineNumber: lastLine,
        //       endLineNumber: lastLine,
        //     },
        //   ]);
        // }
      }}
    />
  );
};
// const editorInstanceRef = useRef<Editor | null>(null);
// const insertionPointRef = useRef<ReturnType<Editor['addLineClass']> | null>(
//   null
// );
// const [{ cursorPosition, highlightLineNumber }, dispatch] = useContext(
//   StoreContext
// );

// const [debouncedChange] = useDebouncedCallback(
//   (newCode: string) => onChange(newCode),
//   100
// );

// const setCursorPosition = useCallback(
//   ({ line, ch }: CursorPosition) => {
//     setTimeout(() => {
//       if (editorInstanceRef.current && !previewCode) {
//         editorInstanceRef.current.focus();
//         editorInstanceRef.current.setCursor(line, ch);
//       }
//     });
//   },
//   [previewCode]
// );

// useEffect(() => {
//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (editorInstanceRef && editorInstanceRef.current) {
//       const cmdOrCtrl = navigator.platform.match('Mac')
//         ? e.metaKey
//         : e.ctrlKey;

//       if (cmdOrCtrl && e.keyCode === 83) {
//         e.preventDefault();
//         const { code: formattedCode, cursor: formattedCursor } = format({
//           code: editorInstanceRef.current.getValue(),
//           cursor: editorInstanceRef.current.getCursor(),
//         });

//         dispatch({
//           type: 'updateCode',
//           payload: { code: formattedCode, cursor: formattedCursor },
//         });
//         editorInstanceRef.current.setValue(formattedCode);
//         editorInstanceRef.current.setCursor(formattedCursor);
//       }

//       if (cmdOrCtrl && /^[k]$/.test(e.key)) {
//         e.preventDefault();
//         dispatch({ type: 'toggleToolbar', payload: { panel: 'snippets' } });
//       }
//     }
//   };

//   window.addEventListener('keydown', handleKeyDown);

//   return () => {
//     window.removeEventListener('keydown', handleKeyDown);
//   };
// }, [dispatch]);

// useEffect(() => {
//   if (editorInstanceRef.current) {
//     if (previewCode) {
//       editorInstanceRef.current.setValue(previewCode);
//     } else {
//       editorInstanceRef.current.getDoc().undo();

//       // prevent redo after undo'ing preview code.
//       const history = editorInstanceRef.current.getDoc().getHistory();
//       editorInstanceRef.current
//         .getDoc()
//         .setHistory({ ...history, undone: [] });
//     }
//   }
// }, [previewCode]);

// useEffect(() => {
//   if (editorInstanceRef.current) {
//     if (
//       editorInstanceRef.current.hasFocus() ||
//       code === editorInstanceRef.current.getValue() ||
//       previewCode
//     ) {
//       return;
//     }

//     editorInstanceRef.current.setValue(code);
//     validateCode(editorInstanceRef.current, code);
//   }
// }, [code, previewCode]);

// useEffect(() => {
//   if (editorInstanceRef.current && !editorInstanceRef.current.hasFocus()) {
//     setCursorPosition(cursorPosition);
//   }
// }, [cursorPosition, setCursorPosition]);

// useEffect(() => {
//   if (editorInstanceRef.current) {
//     if (typeof highlightLineNumber === 'number') {
//       insertionPointRef.current = editorInstanceRef.current.addLineClass(
//         highlightLineNumber,
//         'background',
//         styles.insertionPoint
//       );
//       editorInstanceRef.current.scrollIntoView(
//         {
//           line: highlightLineNumber,
//           ch: 0,
//         },
//         200
//       );
//     } else if (insertionPointRef.current) {
//       editorInstanceRef.current.removeLineClass(
//         insertionPointRef.current,
//         'background'
//       );
//       insertionPointRef.current = null;
//     }
//   }
// }, [highlightLineNumber]);

// return (
//   // @ts-ignore
//   <ReactCodeMirror
//     editorDidMount={(editorInstance) => {
//       editorInstanceRef.current = editorInstance;
//       validateCode(editorInstance, code);
//       setCursorPosition(cursorPosition);
//     }}
//     onChange={(editorInstance, data, newCode) => {
//       if (editorInstance.hasFocus() && !previewCode) {
//         validateCode(editorInstance, newCode);
//         debouncedChange(newCode);
//       }
//     }}
//     onCursorActivity={(editor) => {
//       setTimeout(() => {
//         if (!editor.somethingSelected() && editor.hasFocus()) {
//           const { line, ch } = editor.getCursor();

//           dispatch({
//             type: 'updateCursorPosition',
//             payload: { position: { line, ch }, code: editor.getValue() },
//           });
//         }
//       });
//     }}
//     options={{
//       mode: 'jsx',
//       autoCloseTags: true,
//       autoCloseBrackets: true,
//       theme: 'neo',
//       gutters: [styles.gutter],
//       hintOptions: { schemaInfo: hints },
//       viewportMargin: 50,
//       extraKeys: {
//         Tab: (cm) => {
//           if (cm.somethingSelected()) {
//             // @ts-ignore
//             cm.indentSelection('add');
//           } else {
//             const indent = cm.getOption('indentUnit') as number;
//             const spaces = Array(indent + 1).join(' ');
//             cm.replaceSelection(spaces);
//           }
//         },
//         'Ctrl-Space': completeIfInTag,
//         "'<'": completeAfter,
//         "'/'": completeIfAfterLt,
//         "' '": completeIfInTag,
//         "'='": completeIfInTag,
//       },
//     }}
//   />
// );
