import type { Editor, EditorConfiguration } from 'codemirror';
import { useRef, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

import { UnControlled as ReactCodeMirror } from '../CodeEditor/CodeMirror2';

import 'codemirror/mode/css/css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

const extraKeys: EditorConfiguration['extraKeys'] = {
  Tab: (cm: Editor) => {
    if (cm.somethingSelected()) {
      cm.indentSelection('add');
    } else {
      const indent = cm.getOption('indentUnit') as number;
      const spaces = Array(indent + 1).join(' ');
      cm.replaceSelection(spaces);
    }
  },
};

interface Props {
  cssCode: string;
  onChange: (cssCode: string) => void;
}

export const CssEditor = ({ cssCode, onChange }: Props) => {
  const editorInstanceRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (
      editorInstanceRef.current &&
      cssCode !== editorInstanceRef.current.getValue()
    ) {
      editorInstanceRef.current.setValue(cssCode);
    }
  }, [cssCode]);

  return (
    <ReactCodeMirror
      editorDidMount={(editorInstance) => {
        editorInstanceRef.current = editorInstance;
        editorInstanceRef.current.setValue(cssCode);
      }}
      onChange={(editorInstance, _data, newCode) => {
        if (editorInstance.hasFocus()) {
          onChange(newCode);
        }
      }}
      options={{
        mode: 'css',
        autoCloseBrackets: true,
        theme: 'neo',
        lineNumbers: true,
        viewportMargin: 50,
        extraKeys,
      }}
    />
  );
};
