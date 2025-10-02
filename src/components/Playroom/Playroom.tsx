import { assignInlineVars } from '@vanilla-extract/dynamic';
import snippets from '__PLAYROOM_ALIAS__SNIPPETS__';
import { type ComponentProps, useContext, useRef, useState } from 'react';

import {
  type EditorOrientation,
  StoreContext,
} from '../../contexts/StoreContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Box } from '../Box/Box';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import { primaryMod } from '../CodeEditor/editorCommands';
import { EditorActions } from '../EditorActions/EditorActions';
import { EditorErrorMessage } from '../EditorErrorMessage/EditorErrorMessage';
import Frames from '../Frames/Frames';
import { Header } from '../Header/Header';
import { KeyboardShortcut } from '../KeyboardShortcut/KeyboardShortcut';
import { Logo } from '../Logo/Logo';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

import { ResizeHandle } from './ResizeHandle';

import * as styles from './Playroom.css';

const resizeHandlePosition: Record<
  EditorOrientation,
  ComponentProps<typeof ResizeHandle>['position']
> = {
  horizontal: 'top',
  vertical: 'right',
} as const;

const ZeroState = () => {
  const hasSnippets = snippets && snippets.length > 0;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="full"
      textAlign="center"
      gap="xxxlarge"
    >
      <Text size="large" tone="secondary">
        <Logo size={100} />
      </Text>

      <Stack space="large">
        <Text size="large" tone="secondary">
          Open playroom <KeyboardShortcut shortcut={[primaryMod, 'O']} />
        </Text>
        {hasSnippets ? (
          <Text size="large" tone="secondary">
            Insert snippet <KeyboardShortcut shortcut={[primaryMod, 'K']} />
          </Text>
        ) : null}
      </Stack>

      <Text size="large" tone="secondary">
        ...or just start coding
      </Text>
    </Box>
  );
};

export default () => {
  const [
    {
      editorOrientation,
      editorHeight,
      editorWidth,
      editorHidden,
      code,
      previewRenderCode,
      previewEditorCode,
      title,
      id,
    },
    dispatch,
  ] = useContext(StoreContext);
  useDocumentTitle({ title });

  const editorRef = useRef<HTMLElement | null>(null);
  const [resizing, setResizing] = useState(false);

  const isVerticalEditor = editorOrientation === 'vertical';
  const editorSize = isVerticalEditor ? editorWidth : editorHeight;

  return (
    <Box
      component="main"
      className={{
        [styles.root]: true,
        [styles.resizing]: resizing,
        [styles.editorOrientation[editorOrientation]]: true,
      }}
      style={assignInlineVars({
        [styles.editorSize]: editorHidden ? undefined : editorSize,
      })}
    >
      <Box className={styles.header}>
        <Header />
      </Box>

      <Box position="relative" className={styles.frames}>
        <Box className={styles.framesContainer}>
          {id ? <Frames code={previewRenderCode || code} /> : <ZeroState />}
        </Box>
      </Box>

      <Box
        position="relative"
        className={styles.editor}
        inert={editorHidden}
        ref={editorRef}
      >
        <ResizeHandle
          ref={editorRef}
          position={resizeHandlePosition[editorOrientation]}
          onResize={(newValue) => {
            dispatch({
              type: isVerticalEditor
                ? 'updateEditorWidth'
                : 'updateEditorHeight',
              payload: { size: newValue },
            });
          }}
          onResizeStart={() => setResizing(true)}
          onResizeEnd={(endValue) => {
            setResizing(false);
            dispatch({
              type: isVerticalEditor
                ? 'updateEditorWidth'
                : 'updateEditorHeight',
              payload: { size: endValue },
            });
          }}
        />
        <div className={styles.editorContainer}>
          <CodeEditor
            code={code}
            editorHidden={editorHidden}
            onChange={(newCode: string) =>
              dispatch({ type: 'updateCode', payload: { code: newCode } })
            }
            previewCode={previewEditorCode}
          />
          <div className={styles.editorOverlays}>
            <EditorErrorMessage />
            <EditorActions />
          </div>
        </div>
      </Box>
    </Box>
  );
};
