const hints = {
  Bar: {
    attrs: {
      color: ['red', 'blue'],
      color2: ['yellow', 'orange'],
      color3: ['purple', 'white'],
    },
  },
  Foo: {
    attrs: {
      color: ['red', 'blue'],
    },
  },
};

// monaco.languages.register({
//     'id': 'html'
// })

const getTextUntilPosition = (model, position) => {
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
  provideCompletionItems: function (model, position) {
    const textUntilPosition = getTextUntilPosition(model, position);
    const lastLine = model.getLineCount();
    const textAfterPosition = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: lastLine,
      endColumn: model.getLineLength(lastLine),
    });

    if (!/<\s*$/.test(textUntilPosition) || /^\s*\//.test(textAfterPosition)) {
      return { suggestions: [] };
    }

    return {
      suggestions: Object.keys(hints).map((component) => ({
        label: component,
        kind: monaco.languages.CompletionItemKind.TypeParameter,
        insertText: component,
      })),
    };
  },
});

// Prop name autocomplete
monaco.languages.registerCompletionItemProvider('html', {
  triggerCharacters: [' '],
  provideCompletionItems: function (model, position) {
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
        kind: monaco.languages.CompletionItemKind.Property,
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
  provideCompletionItems: function (model, position) {
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
    const quoteBefore = /=\s*"\s*$/.test(textUntilPosition) ? '' : '"';
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
  provideCompletionItems: (model, position) => {
    const textUntilPosition = getTextUntilPosition(model, position);
    const openTag = textUntilPosition.match(/.*<(\w+).*>$/)?.[1];

    if (!openTag) {
      return { suggestions: [] };
    }

    return {
      suggestions: [
        {
          label: `</${openTag}>`,
          kind: monaco.languages.CompletionItemKind.TypeParameter,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          insertText: `$0</${openTag}>`,
        },
      ],
    };
  },
});

monaco.languages.registerDocumentFormattingEditProvider('html', {
  provideDocumentFormattingEdits: (model) => [
    {
      text: model.getValue().replace(/><(?!\/)/g, '>\n\t<'),
      range: model.getFullModelRange(),
    },
  ],
});

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

monaco.editor.create(document.getElementById('container'), {
  value: `<Dropdown
    id="id"
    label="Nationality"
    placeholder="Please select"
    secondaryLabel="optional"
><Bar color=""></Bar>
    <option value="1">Australia</option>
    <option value="2">Bangladesh</option>
    <option value="3">Bhutan</option>
    <option value="4">Brunei</option>
    <option value="5">Burma</option>
    <option value="6">Cambodia</option>
    <option value="7">Canada</option>
    <option value="8">China</option>
    <option value="9">Chille</option>
    <option value="10">Cook Islands</option>
    <option value="11">Fiji</option>
    <option value="12">India</option>
    <option value="13">Indonesia</option>
    <option value="14">Japan</option>
    <option value="15">Korea, South</option>
    <option value="16">Korea, North</option>
    <option value="17">Laos</option>
    <option value="18">Malaysia</option>
    <option value="19">Maldives</option>
    <option value="20">Mongolia</option>
    <option value="21">Nauru</option>
    <option value="22">Nepal</option>
    <option value="23">New Zealand</option>
    <option value="24">New Caledonia</option>
    <option value="25">Pakistan</option>
    <option value="26">Palau</option>
    <option value="27">Papua New Guinea</option>
    <option value="28">Peru</option>
    <option value="29">Philipines</option>
    <option value="30">Russia</option>
    <option value="31">Samoa</option>
    <option value="32">Singapore</option>
    <option value="33">Solomon Islands</option>
    <option value="34">Sri Lanka</option>
    <option value="35">Thailand</option>
    <option value="36">Timor-Leste</option>
    <option value="37">Tonga</option>
    <option value="38">Vanuatu</option>
    <option value="39">Vietnam</option>
    <option value="40">United State</option>
</Dropdown>`,
  language: 'html',
  minimap: { enabled: false },
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
});
