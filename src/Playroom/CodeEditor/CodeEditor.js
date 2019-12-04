import React from 'react';
import ReactTypes from '!!raw-loader!./reactTypes.d.ts'; // eslint-disable-line
import MonacoEditor from 'react-monaco-editor';

import * as monaco from 'monaco-editor';

import { wrapJsx, unwrapJsx } from '../../utils/formatting';

import styles from './CodeEditor.less';

// import { Controlled as ReactCodeMirror } from 'react-codemirror2';

import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babylon';
// import compileJsx from '../../utils/compileJsx';

// const validateCode = (editorInstanceRef, code) => {
//   // editorInstanceRef.clearGutter(styles.gutter);

//   try {
//     compileJsx(code);
//   } catch (err) {
//     const errorMessage = err && (err.message || '');
//     const matches = errorMessage.match(/\(([0-9]+):/);
//     const lineNumber =
//       matches && matches.length >= 2 && matches[1] && parseInt(matches[1], 10);

//     if (lineNumber) {
//       const marker = document.createElement('div');
//       // marker.classList.add(styles.marker);
//       marker.setAttribute('title', err.message);
//       // editorInstanceRef.setGutterMarker(lineNumber - 1, styles.gutter, marker);
//     }
//   }
// };

const monacoOptions = {
  language: 'typescript',
  theme: 'playroom',
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
  renderIndentGuides: true,
  wordBasedSuggestions: false,
  suggestLineHeight: 36,
  suggest: {
    showIcons: false,
    filteredTypes: {
      keyword: false,
      module: false,
      variable: false,
      reference: false
      // Available types to filter: [
      //   "Method",
      //   "Function",
      //   "Constructor",
      //   "Field",
      //   "Variable",
      //   "Class",
      //   "Struct",
      //   "Interface",
      //   "Module",
      //   "Property",
      //   "Event",
      //   "Operator",
      //   "Unit",
      //   "Value",
      //   "Constant",
      //   "Enum",
      //   "EnumMember",
      //   "Keyword",
      //   "Text",
      //   "Color",
      //   "File",
      //   "Reference",
      //   "Customcolor",
      //   "Folder",
      //   "TypeParameter",
      //   "Snippet"
      // ]
    }
  },
  model: monaco.editor.createModel(
    '',
    'typescript',
    monaco.Uri.file('file:///file.tsx')
  )
};

const configureMonacoInstance = monaco => {
  monaco.editor.defineTheme('playroom', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editorIndentGuide.background': '#ffffff',
      'editorIndentGuide.activeBackground': '#d5d5d5',
      'editorSuggestWidget.selectedBackground': '#08f',
      'editorSuggestWidget.highlightForeground': '#000'
      // 'dropdown.background': '#fff',
      // 'list.focusBackground': '#ff0000',
      // 'list.focusForeground': '#ff0000',
      // 'list.activeSelectionBackground': '#ff0000',
      // 'list.activeSelectionForeground': '#ff0000',
      // 'list.inactiveSelectionBackground': '#ff0000',
      // 'list.inactiveSelectionForeground': '#ff0000',
      // 'list.hoverBackground': '#ff0000',
      // 'list.hoverForeground': '#ff0000',
      // 'list.dropBackground': '#ff0000',
      // 'list.highlightForeground': '#ff0000'
    }
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: true
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    jsx: monaco.languages.typescript.JsxEmit.React,
    noEmit: true,
    noLib: true
  });

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    ReactTypes,
    'file:///node_modules/@types/react/index.d.ts'
  );

  monaco.languages.typescript.typescriptDefaults.addExtraLib(`
    import * as components from 'components';

    declare global {
      export const Foo: typeof components.Foo;
      export const Bar: typeof components.Bar;
    }
  `);
  monaco.languages.typescript.typescriptDefaults.addExtraLib(`
    // import { Component } from 'react';

    declare module 'components' {
      interface FooProps {
        color: 'red' | 'blue';
      }
      export const Foo = (props: FooProps) => JSX.Element;

      interface BarProps {
        color: 'red' | 'blue';
      }
      export const Bar = (props: BarProps) => JSX.Element;
    }
  `);
  // `);

  monaco.languages.registerDocumentFormattingEditProvider('typescript', {
    provideDocumentFormattingEdits(model) {
      let text;
      try {
        text = prettier.format(wrapJsx(model.getValue()), {
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
          text: unwrapJsx(text)
        }
      ];
    }
  });
};

export const CodeEditor = ({ code, onChange, hints }) => {
  // const ref = useRef();
  // const editorRef = useRef();
  // const pauseChangeEvents = useRef(false);

  // useEffect(() => {
  //   configureMonacoInstance(monaco);
  //   const editor = monaco.editor.create(ref.current, monacoOptions);
  //   editorRef.current = editor;

  //   editor.addCommand(
  //     monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
  //     () => editor.getAction('editor.action.formatDocument').run()
  //   );
  // }, []);

  // useEffect(
  //   () => {
  //     if (editorRef.current) {
  //       const editor = editorRef.current;

  //       editor.onDidChangeModelContent(() => {
  //         if (!pauseChangeEvents.current) {
  //           onChange(editor.getValue());
  //         }
  //       });
  //     }
  //   },
  //   [onChange]
  // );

  // useEffect(
  //   () => {
  //     if (editorRef.current) {
  //       const editor = editorRef.current;
  //       const model = editor.getModel();

  //       if (code !== null && code !== model.getValue()) {
  //         pauseChangeEvents.current = true;
  //         editor.pushUndoStop();
  //         model.pushEditOperations(
  //           [],
  //           [
  //             {
  //               range: model.getFullModelRange(),
  //               text: code
  //             }
  //           ]
  //         );
  //         editor.pushUndoStop();
  //         pauseChangeEvents.current = false;
  //       }
  //     }
  //   },
  //   [code, editorRef, onChange]
  // );

  return (
    // <div ref={ref} style={{ height: '100%', width: '100%' }} />
    <MonacoEditor
      options={monacoOptions}
      value={code}
      onChange={onChange}
      editorWillMount={configureMonacoInstance}
      editorDidMount={editor => {
        editor.addCommand(
          monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
          () => editor.getAction('editor.action.formatDocument').run()
        );
      }}
    />
  );
};
