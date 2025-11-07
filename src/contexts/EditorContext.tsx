import type { Editor } from 'codemirror';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';

import type { EditorCommand } from '../components/CodeEditor/editorCommands';

interface EditorValue {
  registerEditor: (cm: Editor) => void;
  runCommand: (command: EditorCommand) => void;
}

const EditorContext = createContext<EditorValue | null>(null);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const editorRef = useRef<Editor | null>(null);

  const registerEditor = useCallback((cm: Editor) => {
    editorRef.current = cm;
  }, []);

  const runCommand = useCallback((command: EditorCommand) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
    editorRef.current.execCommand(command);
  }, []);

  return (
    <EditorContext.Provider value={{ registerEditor, runCommand }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }

  return context;
};
