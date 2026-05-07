import type { Editor, LineHandle } from 'codemirror';
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
  scrollToLine: (line: number) => void;
  highlightLine: (line: number | null) => void;
  fadeHighlight: () => void;
}

const EditorContext = createContext<EditorValue | null>(null);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const editorRef = useRef<Editor | null>(null);
  const highlightLineRef = useRef<LineHandle | null>(null);

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

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToLine = useCallback((line: number) => {
    if (!editorRef.current) {
      return;
    }
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      if (!editorRef.current) {
        return;
      }
      const coords = editorRef.current.charCoords({ line, ch: 0 }, 'local');
      const scrollInfo = editorRef.current.getScrollInfo();
      const targetTop = coords.top - scrollInfo.clientHeight / 2;
      editorRef.current.getScrollerElement().scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    }, 150);
  }, []);

  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const highlightLine = useCallback((line: number | null) => {
    if (!editorRef.current) {
      return;
    }

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    if (highlightLineRef.current) {
      editorRef.current.removeLineClass(
        highlightLineRef.current,
        'background',
        'cm-inspect-highlight'
      );
      editorRef.current.removeLineClass(
        highlightLineRef.current,
        'background',
        'cm-inspect-highlight-fade'
      );
      highlightLineRef.current = null;
    }

    if (line !== null) {
      highlightLineRef.current = editorRef.current.addLineClass(
        line,
        'background',
        'cm-inspect-highlight'
      );
    } else if (line === null && highlightLineRef.current === null) {
      return;
    }
  }, []);

  const fadeHighlight = useCallback(() => {
    if (!editorRef.current || !highlightLineRef.current) {
      return;
    }

    editorRef.current.removeLineClass(
      highlightLineRef.current,
      'background',
      'cm-inspect-highlight'
    );
    editorRef.current.addLineClass(
      highlightLineRef.current,
      'background',
      'cm-inspect-highlight-fade'
    );

    fadeTimerRef.current = setTimeout(() => {
      if (!editorRef.current || !highlightLineRef.current) {
        return;
      }
      editorRef.current.removeLineClass(
        highlightLineRef.current,
        'background',
        'cm-inspect-highlight-fade'
      );
      highlightLineRef.current = null;
      fadeTimerRef.current = null;
    }, 1000);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        registerEditor,
        runCommand,
        scrollToLine,
        highlightLine,
        fadeHighlight,
      }}
    >
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
