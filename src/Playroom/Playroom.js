import React, { useState, useEffect } from 'react';
import parsePropTypes from 'parse-prop-types';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import Resizable from 're-resizable';
import Preview from './Preview/Preview';
import styles from './Playroom.less';
import { store } from '../index';
import WindowPortal from './WindowPortal';
import { CodeEditor } from './CodeEditor/CodeEditor';
import { useEditorContext } from './CodeEditor/EditorContext';

const themesImport = require('./themes');
const componentsImport = require('./components');
const patternsImport = require('./patterns');

const resizableConfig = (position = 'bottom') => ({
  top: position === 'bottom',
  right: position === 'left',
  bottom: false,
  left: position === 'right',
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
});

let firstLoad = true;
export default ({ getCode, updateCode: persistCode, staticTypes, widths }) => {
  const [themes, setThemes] = useState(themesImport);
  const [components, setComponents] = useState(componentsImport);
  const [patterns, setPatterns] = useState(patternsImport);

  const [code, setCode] = useState('');
  const [previewCode, setPreviewCode] = useState(null);
  const [codeReady, setCodeReady] = useState(false);
  const {
    editorPosition,
    editorSize,
    setEditorSize,
    setEditorPosition
  } = useEditorContext();

  useEffect(() => {
    if (module.hot) {
      module.hot.accept('./themes', () => {
        setThemes(require('./themes'));
      });

      module.hot.accept('./components', () => {
        setComponents(require('./components'));
      });

      module.hot.accept('./patterns', () => {
        setPatterns(require('./patterns'));
      });
    }

    Promise.all([
      getCode(),
      store.getItem('editorHeight'),
      store.getItem('editorWidth'),
      store.getItem('editorPosition')
    ]).then(
      ([resolvedCode, resolvedHeight, resolvedWidth, resolvedPosition]) => {
        if (firstLoad) {
          if (resolvedPosition) {
            setEditorPosition(resolvedPosition);
          }
          if (resolvedHeight || resolvedWidth) {
            setEditorSize(
              /(left|right)/.test(resolvedPosition)
                ? resolvedWidth
                : resolvedHeight,
              resolvedPosition
            );
          }
          firstLoad = false;
        }
        setCode(resolvedCode);
        setCodeReady(true);
      }
    );
  }, [getCode, setEditorSize, setEditorPosition, editorPosition]);

  useEffect(() => {
    debounce(persistCode, 500)(code);
  }, [code, persistCode]);

  const themeNames = Object.keys(themes);
  const frames = flatMap(widths, width =>
    themeNames.map(theme => {
      return { theme, width };
    })
  );

  const componentNames = Object.keys(components).sort();
  const tags = Object.assign(
    {},
    ...componentNames.map(componentName => {
      const staticTypesForComponent = staticTypes[componentName];
      if (
        staticTypesForComponent &&
        Object.keys(staticTypesForComponent).length > 0
      ) {
        return {
          [componentName]: {
            attrs: staticTypesForComponent
          }
        };
      }

      const parsedPropTypes = parsePropTypes(components[componentName]);
      const filteredPropTypes = omit(parsedPropTypes, 'children', 'className');
      const propNames = Object.keys(filteredPropTypes);

      return {
        [componentName]: {
          attrs: Object.assign(
            {},
            ...propNames.map(propName => {
              const propType = filteredPropTypes[propName].type;

              return {
                [propName]:
                  propType.name === 'oneOf'
                    ? propType.value.filter(x => typeof x === 'string')
                    : null
              };
            })
          )
        }
      };
    })
  );

  if (!codeReady) {
    return null;
  }

  const codeEditor = (
    <CodeEditor
      code={code}
      onChange={setCode}
      hints={tags}
      patterns={
        typeof patterns.default !== 'undefined' ? patterns.default : patterns
      }
      onEditorPositionChange={position => setEditorPosition(position)}
      editorPosition={editorPosition}
      onPreviewCode={newPreviewCode => {
        setPreviewCode(newPreviewCode);
      }}
    />
  );

  const size = {
    height: editorPosition === 'bottom' ? `${editorSize}px` : '100vh', // issue in ff & safari when not a string
    width: /(left|right)/.test(editorPosition) ? `${editorSize}px` : '100vw'
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={() => {
          store.getItem('editorPosition').then(position => {
            if (position === 'undocked') {
              setEditorPosition('bottom');
            }
          });
        }}
      >
        {codeEditor}
      </WindowPortal>
    ) : (
      <Resizable
        className={`${styles.editorContainer} ${[
          editorPosition === 'undocked'
            ? styles.editorContainer_isUndocked
            : '',
          editorPosition === 'right' ? styles.editorContainer_isRight : '',
          editorPosition === 'left' ? styles.editorContainer_isLeft : '',
          editorPosition === 'bottom' ? styles.editorContainer_isBottom : ''
        ].join(' ')}`}
        defaultSize={size}
        size={size}
        onResize={(event, direction, ref) => {
          debounce(currentSize => {
            setEditorSize(currentSize, editorPosition);
          }, 1)(
            editorPosition === 'bottom' ? ref.offsetHeight : ref.offsetWidth
          );
        }}
        enable={resizableConfig(editorPosition)}
      >
        {codeEditor}
      </Resizable>
    );

  return (
    <div className={styles.root}>
      <div
        className={styles.previewContainer}
        style={{
          bottom: editorPosition === 'bottom' ? editorSize : undefined,
          right: editorPosition === 'right' ? editorSize : undefined,
          left: editorPosition === 'left' ? editorSize : undefined
        }}
      >
        <Preview code={previewCode || code} themes={themes} frames={frames} />
      </div>
      {editorContainer}
    </div>
  );
};
