import React from 'react';

import MonacoEditor from 'react-monaco-editor';

import * as monaco from 'monaco-editor';

import { wrapJsx, unwrapJsx } from '../../utils/formatting';

import styles from './CodeEditor.less';

import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babylon';

import { SuggestAdapter } from 'monaco-editor/esm/vs/language/typescript/languageFeatures';

const typeInfo = __PLAYROOM_GLOBAL__TYPE_INFO__;

Object.defineProperty(SuggestAdapter.prototype, 'triggerCharacters', {
  get() {
    return ['<', '=', ' ', monaco.KeyCode.Enter];
  },
  enumerable: true,
  configurable: true
});

const iDontLikeSand = SuggestAdapter.prototype.provideCompletionItems;
SuggestAdapter.prototype.provideCompletionItems = function(...args) {
  const itsCoarse = iDontLikeSand.call(this, ...args);
  const model = args[0];
  const position = args[1];
  const triggerCharacter = model
    .getLinesContent()
    [position.lineNumber - 1].charAt(position.column - 2);

  return itsCoarse.then(({ suggestions }) => {
    console.log(suggestions);

    if (!Array.isArray(suggestions)) {
      return { suggestions };
    }

    let newSuggestions = suggestions.slice();

    if (triggerCharacter === '<') {
      console.log('trigger');

      // Don't suggest native HTML elements as first character
      newSuggestions = newSuggestions.filter(({ label }) =>
        typeInfo.components.includes(label)
      );
    }

    // Hack fix to remove suggestions of previous attribute values as keys
    const isAttributeKeySuggestion = newSuggestions.some(
      ({ label }) => label === 'key'
    );
    if (isAttributeKeySuggestion) {
      // newSuggestions = newSuggestions.filter(({ kind }) => kind !== 9);

      // Don't suggest built-in react props (e.g. key, ref & children)
      newSuggestions = newSuggestions.filter(
        ({ label }) => !['children', 'ref'].includes(label)
      );
    }

    console.log(newSuggestions);

    return {
      suggestions: newSuggestions
    };
  });
};

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

      // class: false,
      // color: false,
      // constant: false,
      // constructor: false,
      // customcolor: false,
      // enum: false,
      // enummember: false,
      // event: false,
      // field: false,
      // file: false,
      // folder: false,
      // function: false,
      interface: false,
      // keyword: false,
      // method: false,
      // module: false,
      // operator: false,
      // property: true,
      reference: false,
      // snippet: false,
      // struct: false,
      // text: false,
      // typeparameter: false,
      // unit: false,
      // value: false,
      variable: false
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
    noSemanticValidation: true,
    noSyntaxValidation: true
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    esModuleInterop: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
    noEmit: true,
    noLib: true
  });

  Object.entries(typeInfo.declarations).forEach(([fileName, content]) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      content,
      `file:///${fileName}`
    );
  });

  const globalComponentsDeclaration = `
    import * as components from './${typeInfo.componentsFile.replace(
      /\.[^/.]+$/,
      ''
    )}';

    declare global {
      ${typeInfo.components
        .map(
          componentName =>
            `const ${componentName}: typeof components.${componentName};`
        )
        .join('\n')}
    }
  `;

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    globalComponentsDeclaration,
    'file:///playroom.d.ts'
  );

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

export const CodeEditor = ({ code, onChange }) => {
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
        editor.onDidChangeModelDecorations(() => {
          const model = editor.getModel();
          const markers = monaco.editor.getModelMarkers({
            owner: 'typescript',
            resource: model.uri
          });

          // We have to filter out the error that the editor gives on global returns.
          // Unfortunately the error code is null in the marker, so we have option but to
          // match on the text of the error.
          // It will be obvious if this regresses.
          const filtered = markers.filter(
            marker =>
              marker.message !==
              'Left side of comma operator is unused and has no side effects.'
          );
          if (filtered.length !== markers.length) {
            monaco.editor.setModelMarkers(model, 'typescript', filtered);
          }
        });

        editor.addCommand(
          monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
          () => editor.getAction('editor.action.formatDocument').run()
        );
      }}
    />
  );
};
