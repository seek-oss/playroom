import React, { Component } from 'react';
import parsePropTypes from 'parse-prop-types';
import flatMap from 'lodash/flatMap';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { transform } from 'buble';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import Resizable from 're-resizable';
import Preview from './Preview/Preview';
import styles from './Playroom.less';

import { store } from '../index';
import WindowPortal from './WindowPortal';
import UndockSvg from '../assets/icons/NewWindowSvg';
import { formatCode } from '../utils/formatting';

import { Controlled as ReactCodeMirror } from 'react-codemirror2';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/xml-hint';

const themesImport = require('./themes');
const componentsImport = require('./components');

const compileJsx = code =>
  transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`).code;

const resizableConfig = {
  top: true,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false
};

const completeAfter = (cm, predicate) => {
  const CodeMirror = cm.constructor;
  if (!predicate || predicate()) {
    setTimeout(() => {
      if (!cm.state.completionActive) {
        cm.showHint({ completeSingle: false });
      }
    }, 100);
  }

  return CodeMirror.Pass;
};

const completeIfAfterLt = cm => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const cur = cm.getCursor();
    // eslint-disable-next-line new-cap
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });
};

const completeIfInTag = cm => {
  const CodeMirror = cm.constructor;

  return completeAfter(cm, () => {
    const tok = cm.getTokenAt(cm.getCursor());
    if (
      tok.type === 'string' &&
      (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
        tok.string.length === 1)
    ) {
      return false;
    }
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
};

export default class Playroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      themes: themesImport,
      components: componentsImport,
      codeReady: false,
      code: null,
      renderCode: null,
      height: 200,
      editorUndocked: false
    };
  }

  componentDidMount = () => {
    if (module.hot) {
      module.hot.accept('./themes', () => {
        this.setState({ themes: require('./themes') });
      });

      module.hot.accept('./components', () => {
        this.setState({ components: require('./components') });
      });
    }

    Promise.all([this.props.getCode(), store.getItem('editorSize')]).then(
      ([code, height]) => {
        if (height) {
          this.setState({
            height
          });
        }
        this.initialiseCode(code);
        this.validateCode(code);
      }
    );

    window.addEventListener('keydown', this.handleKeyPress);
  };

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  storeCodeMirrorInstance = editorInstance => {
    this.editorInstance = editorInstance;
  };

  setEditorUndocked = val => {
    this.setState({
      editorUndocked: val
    });
  };

  initialiseCode = code => {
    let renderCode;

    try {
      renderCode = compileJsx(code);
    } catch (err) {
      renderCode = '';
    }

    this.setState({
      codeReady: true,
      code,
      renderCode
    });
  };

  updateCode = code => {
    this.props.updateCode(code);
    this.validateCode(code);
  };

  validateCode = code => {
    this.editorInstance.clearGutter(styles.gutter);

    try {
      this.setState({ renderCode: compileJsx(code) });
    } catch (err) {
      const errorMessage = err && (err.message || '');

      const matches = errorMessage.match(/\(([0-9]+):/);

      const lineNumber =
        matches &&
        matches.length >= 2 &&
        matches[1] &&
        parseInt(matches[1], 10);

      if (!lineNumber) {
        return;
      }

      const marker = document.createElement('div');
      marker.classList.add(styles.marker);
      marker.setAttribute('title', err.message);
      this.editorInstance.setGutterMarker(
        lineNumber - 1,
        styles.gutter,
        marker
      );
    }
  };

  handleKeyPress = e => {
    if (
      e.keyCode === 83 &&
      (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();

      const { code } = this.state;

      const { formattedCode, line, ch } = formatCode({
        code,
        cursor: this.editorInstance.codeMirror.getCursor()
      });

      this.setState({ code: formattedCode });
      this.updateCode(formattedCode);
      this.editorInstance.setValue(formattedCode);
      this.editorInstance.focus();
      this.editorInstance.setCursor({
        line,
        ch
      });
    }
  };

  updateHeight = (event, direction, ref) => {
    this.setState({
      height: ref.offsetHeight
    });
    store.setItem('editorSize', ref.offsetHeight);
  };

  updateCodeDebounced = debounce(this.updateCode, 500);
  handleChange = (editor, data, code) => {
    this.setState({ code });
    this.updateCodeDebounced(code);
  };

  handleResize = debounce(this.updateHeight, 200);

  handleUndockEditor = () => {
    this.setEditorUndocked(true);
  };

  handleRedockEditor = () => {
    this.setEditorUndocked(false);
  };

  render() {
    const { staticTypes, widths } = this.props;
    const {
      themes,
      components,
      codeReady,
      code,
      renderCode,
      height,
      editorUndocked
    } = this.state;

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
        const filteredPropTypes = omit(
          parsedPropTypes,
          'children',
          'className'
        );
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

    const codeMirrorEl = (
      <ReactCodeMirror
        editorDidMount={this.storeCodeMirrorInstance}
        value={code}
        onBeforeChange={this.handleChange}
        options={{
          mode: 'jsx',
          autoCloseTags: true,
          autoCloseBrackets: true,
          theme: 'neo',
          gutters: [styles.gutter],
          hintOptions: { schemaInfo: tags },
          extraKeys: {
            Tab: cm => {
              if (cm.somethingSelected()) {
                cm.indentSelection('add');
              } else {
                const indent = cm.getOption('indentUnit');
                const spaces = Array(indent + 1).join(' ');
                cm.replaceSelection(spaces);
              }
            },
            "'<'": completeAfter,
            "'/'": completeIfAfterLt,
            "' '": completeIfInTag,
            "'='": completeIfInTag
          }
        }}
      />
    );

    if (editorUndocked && codeReady) {
      return (
        <div>
          <div className={styles.previewContainer}>
            <Preview code={renderCode} themes={themes} frames={frames} />
          </div>
          <WindowPortal
            height={window.outerHeight}
            width={window.outerWidth}
            onClose={this.handleRedockEditor}
            onKeyDown={this.handleKeyPress}
          >
            <div className={styles.undockedEditorContainer}>{codeMirrorEl}</div>
          </WindowPortal>
        </div>
      );
    }

    return !codeReady ? null : (
      <div className={styles.root}>
        <div
          className={styles.previewContainer}
          style={{ bottom: this.state.height }}
        >
          <Preview code={renderCode} themes={themes} frames={frames} />
        </div>
        <Resizable
          className={styles.editorContainer}
          defaultSize={{
            height: `${height}`, // issue in ff & safari when not a string
            width: '100vw'
          }}
          style={{
            position: 'fixed'
          }}
          onResize={this.handleResize}
          enable={resizableConfig}
        >
          <div className={styles.toolbar}>
            <UndockSvg
              title="Undock editor"
              className={styles.toolbarIcon}
              onClick={this.handleUndockEditor}
            />
          </div>
          {codeMirrorEl}
        </Resizable>
      </div>
    );
  }
}
