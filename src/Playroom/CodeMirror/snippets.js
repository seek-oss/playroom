import React from 'react';
import extraTooltip from './extra-tooltip';
import dedent from 'dedent';
import styles from './snippets.less';

class Tooltip extends React.Component {
  componentDidMount() {
    this.props.cm.constructor.colorize();
  }

  componentDidUpdate() {
    this.props.cm.constructor.colorize();
  }

  render() {
    return (
      <pre data-lang="jsx" className={styles.pre}>
        {dedent(this.props.data.text)}
      </pre>
    );
  }
}

const showSnippets = (config = {}) => {
  const snippets = Object.keys(config).reduce((all, displayText) => {
    all.push({ text: config[displayText], displayText });
    return all;
  }, []);

  return cm => {
    if (!snippets.length) {
      return;
    }

    const CodeMirror = cm.constructor;
    const pos = CodeMirror.Pos;

    cm.showHint({
      completeSingle: false,
      hint: () => {
        const cursor = cm.getCursor();
        const token = cm.getTokenAt(cursor);
        const start = token.start;
        const end = cursor.ch;
        const line = cursor.line;
        const currentWord = token.string;
        const list = snippets.filter(
          item => item.text.indexOf(currentWord) >= 0
        );
        const hint = {
          list: list.length ? list : snippets,
          from: pos(line, start),
          to: pos(line, end)
        };

        return extraTooltip(cm, hint, Tooltip, data => data);
      }
    });
  };
};

export default showSnippets;
