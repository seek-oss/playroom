import { useContext, type ComponentType, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import Frames from './Frames/Frames';
import { WindowPortal } from './WindowPortal';
import type { Snippets } from '../../utils';
import componentsToHints from '../utils/componentsToHints';
import Toolbar from './Toolbar/Toolbar';
import ChevronIcon from './icons/ChevronIcon';
import { StatusMessage } from './StatusMessage/StatusMessage';
import {
  StoreContext,
  type EditorPosition,
} from '../StoreContext/StoreContext';

import { CodeEditor } from './CodeEditor/CodeEditor';

import * as styles from './Playroom.css';
import { Box } from './Box/Box';

import { assignInlineVars } from '@vanilla-extract/dynamic';

const resizableConfig = (position: EditorPosition = 'bottom') => ({
  top: position === 'bottom',
  right: false,
  bottom: false,
  left: position === 'right',
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
});

const resolveDirection = (
  editorPosition: EditorPosition,
  editorHidden: boolean
) => {
  if (editorPosition === 'right') {
    return editorHidden ? 'left' : 'right';
  }

  return editorHidden ? 'up' : 'down';
};

const getTitle = (title: string | undefined) => {
  if (title) {
    return `${title} | Playroom`;
  }

  const configTitle = window?.__playroomConfig__.title;

  if (configTitle) {
    return `${configTitle} | Playroom`;
  }

  return 'Playroom';
};

export interface PlayroomProps {
  components: Record<string, ComponentType>;
  themes: string[];
  widths: number[];
  snippets: Snippets;
}

export default ({ components, themes, widths, snippets }: PlayroomProps) => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      editorHidden,
      visibleThemes,
      visibleWidths,
      code,
      previewRenderCode,
      previewEditorCode,
      ready,
      title,
    },
    dispatch,
  ] = useContext(StoreContext);
  const displayedTitle = getTitle(title);

  const updateEditorSize = useDebouncedCallback(
    ({
      isVerticalEditor,
      offsetWidth,
      offsetHeight,
    }: {
      isVerticalEditor: boolean;
      offsetHeight: number;
      offsetWidth: number;
    }) => {
      dispatch({
        type: isVerticalEditor ? 'updateEditorWidth' : 'updateEditorHeight',
        payload: { size: isVerticalEditor ? offsetWidth : offsetHeight },
      });
    },
    1
  );

  const resetEditorPosition = useDebouncedCallback(() => {
    if (editorPosition === 'undocked') {
      dispatch({ type: 'resetEditorPosition' });
    }
  }, 1);

  if (!ready) {
    return null;
  }

  const codeEditor = (
    <Fragment>
      <div className={styles.editorContainer}>
        <CodeEditor
          code={code}
          editorHidden={editorHidden}
          onChange={(newCode: string) =>
            dispatch({ type: 'updateCode', payload: { code: newCode } })
          }
          previewCode={previewEditorCode}
          hints={componentsToHints(components)}
        />
        <StatusMessage />
      </div>
      <div className={styles.toolbarContainer}>
        <Toolbar widths={widths} themes={themes} snippets={snippets} />
      </div>
    </Fragment>
  );

  const isVerticalEditor = editorPosition === 'right';
  const isHorizontalEditor = editorPosition === 'bottom';
  const sizeStyles = {
    height: isHorizontalEditor ? editorHeight : 'auto',
    width: isVerticalEditor ? editorWidth : 'auto',
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={resetEditorPosition}
        onError={resetEditorPosition}
      >
        {codeEditor}
      </WindowPortal>
    ) : (
      <Resizable
        className={classnames(styles.resizableContainer, {
          [styles.resizableContainer_isRight]: isVerticalEditor,
          [styles.resizableContainer_isBottom]: isHorizontalEditor,
          [styles.resizableContainer_isHidden]: editorHidden,
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        minWidth={isVerticalEditor ? styles.MIN_WIDTH : undefined}
        minHeight={styles.MIN_HEIGHT}
        onResize={(_event, _direction, { offsetWidth, offsetHeight }) => {
          updateEditorSize({ isVerticalEditor, offsetWidth, offsetHeight });
        }}
        enable={resizableConfig(editorPosition)}
      >
        {codeEditor}
      </Resizable>
    );

  return (
    <div className={styles.root}>
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}
      <Box
        className={[
          styles.previewContainer,
          editorHidden
            ? undefined
            : styles.previewContainerPosition[editorPosition],
        ]}
        style={assignInlineVars({
          [styles.editorSize]:
            editorPosition === 'right' ? editorWidth : editorHeight,
        })}
      >
        <Frames
          code={previewRenderCode || code}
          themes={
            visibleThemes && visibleThemes.length > 0 ? visibleThemes : themes
          }
          widths={
            visibleWidths && visibleWidths.length > 0 ? visibleWidths : widths
          }
        />
        <div
          className={classnames(styles.toggleEditorContainer, {
            [styles.isBottom]: isHorizontalEditor,
          })}
        >
          <button
            className={styles.toggleEditorButton}
            title={`${editorHidden ? 'Show' : 'Hide'} the editor`}
            onClick={() =>
              dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' })
            }
          >
            <ChevronIcon
              size={16}
              direction={resolveDirection(editorPosition, editorHidden)}
            />
          </button>
        </div>
      </Box>
      {editorContainer}
    </div>
  );
};
