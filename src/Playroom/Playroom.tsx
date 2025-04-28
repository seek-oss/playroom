import { assignInlineVars } from '@vanilla-extract/dynamic';
import classnames from 'classnames';
import { Resizable } from 're-resizable';
import {
  useContext,
  type ComponentType,
  useState,
  useEffect,
  Fragment,
} from 'react';
import { Helmet } from 'react-helmet';
import { useDebouncedCallback } from 'use-debounce';

import type { Snippets } from '../../utils';
import {
  type EditorPosition,
  StoreContext,
} from '../StoreContext/StoreContext';
import componentsToHints from '../utils/componentsToHints';

import { Box } from './Box/Box';
import { CodeEditor } from './CodeEditor/CodeEditor';
import Frames from './Frames/Frames';
import { StatusMessage } from './StatusMessage/StatusMessage';
import Toolbar from './Toolbar/Toolbar';
import { ANIMATION_TIMEOUT } from './constants';
import ChevronIcon from './icons/ChevronIcon';

import * as styles from './Playroom.css';

type EditorOrientation = 'vertical' | 'horizontal';

const staticTypes = __PLAYROOM_GLOBAL__STATIC_TYPES__;

const resizableConfig = (position: EditorPosition = 'bottom') => ({
  top: position === 'bottom',
  right: position === 'left',
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
  } else if (editorPosition === 'left') {
    return editorHidden ? 'right' : 'left';
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
  components: Record<string, ComponentType<any>>;
  themes: string[];
  widths: Array<number | 'Fit to window'>;
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

  // This is necessary because this updates slightly after editorHidden updates,
  // not at the same time
  const [editorVisibilityAfterTransition, setEditorVisibilityAfterTransition] =
    useState<boolean>(editorHidden);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEditorVisibilityAfterTransition(editorHidden);
    }, ANIMATION_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [editorHidden]);

  const editorAvailable = !editorHidden && !editorVisibilityAfterTransition;

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

  if (!ready) {
    return null;
  }

  const editorOrientation: EditorOrientation =
    editorPosition === 'bottom' ? 'horizontal' : 'vertical';

  const sizeStyles = {
    height: editorOrientation === 'horizontal' ? editorHeight : 'auto',
    width: editorOrientation === 'vertical' ? editorWidth : 'auto',
  };
  const hiddenSizeStyles = {
    height: editorOrientation === 'horizontal' ? 0 : 'auto',
    width: editorOrientation === 'vertical' ? 0 : 'auto',
  };

  const resizableHandleMap: Record<EditorPosition, string> = {
    bottom: 'top',
    right: 'left',
    left: 'right',
  };

  const framesArea = (
    <>
      <Frames
        code={previewRenderCode || code}
        themes={
          visibleThemes && visibleThemes.length > 0 ? visibleThemes : themes
        }
        widths={
          visibleWidths && visibleWidths.length > 0 ? visibleWidths : widths
        }
      />
      <Box
        position="absolute"
        bottom={0}
        right={editorPosition !== 'left' ? 0 : undefined}
        className={
          editorPosition === 'bottom' && styles.bottomToggleEditorContainer
        }
      >
        <Box
          component="button"
          position="relative"
          cursor="pointer"
          width="full"
          appearance="none"
          border={0}
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
        </Box>
      </Box>
    </>
  );

  const editorContainer = (
    <Resizable
      style={assignInlineVars({
        [styles.editorSize]:
          editorPosition === 'bottom' ? editorHeight : editorWidth,
      })}
      className={classnames({
        [styles.resizable]: true,
        [styles.resizableSize[editorOrientation]]: !editorHidden,
        [styles.resizableUnavailable]: !editorAvailable,
        [styles.resizableAvailable[editorOrientation]]: editorAvailable,
      })}
      defaultSize={sizeStyles}
      size={editorHidden ? hiddenSizeStyles : sizeStyles}
      onResize={(_event, _direction, { offsetWidth, offsetHeight }) => {
        updateEditorSize({
          isVerticalEditor: editorOrientation === 'vertical',
          offsetWidth,
          offsetHeight,
        });
      }}
      onResizeStart={(_event, _direction, _refToElement) => {
        _refToElement.classList.remove(styles.resizableSize[editorOrientation]);
      }}
      onResizeStop={(_event, _direction, _refToElement) => {
        _refToElement.classList.add(styles.resizableSize[editorOrientation]);
      }}
      enable={resizableConfig(editorPosition)}
      /*
       * Ensures resizable handles are stacked above the `codeEditor` component.
       * By default, handles are stacked below the editor as introduced in:
       * https://github.com/bokuweb/re-resizable/pull/827
       */
      handleStyles={{
        [resizableHandleMap[editorPosition]]: { zIndex: 1 },
      }}
    >
      <Fragment>
        <Box inert={editorHidden} position="absolute" inset={0}>
          <CodeEditor
            code={code}
            editorHidden={editorHidden}
            onChange={(newCode: string) =>
              dispatch({ type: 'updateCode', payload: { code: newCode } })
            }
            previewCode={previewEditorCode}
            hints={componentsToHints(components, staticTypes)}
          />
          <StatusMessage />
        </Box>
      </Fragment>
    </Resizable>
  );

  return (
    <Box width="viewport" height="viewport" display="flex">
      {title === undefined ? null : (
        <Helmet>
          <title>{displayedTitle}</title>
        </Helmet>
      )}

      <Toolbar widths={widths} themes={themes} snippets={snippets} />

      <Box
        display="flex"
        width="full"
        height="full"
        className={styles.root[editorPosition]}
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Box
          position="relative"
          flexGrow={1}
          className={styles.previewContainer}
        >
          {framesArea}
        </Box>

        {editorContainer}
      </Box>
    </Box>
  );
};
