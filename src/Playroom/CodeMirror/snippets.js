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

const showSnippets = (cm, config = {}, code, changeRenderedCode) => {
  const snippets = Object.keys(config).reduce((all, displayText) => {
    all.push({ text: config[displayText], displayText });
    return all;
  }, []);

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
      const start =
        token.type === 'tag bracket' ? token.start + 1 : token.start;
      const end = cursor.ch;
      const line = cursor.line;
      const currentWord = token.string;
      const list = snippets.filter(item => item.text.indexOf(currentWord) >= 0);
      const hint = {
        list: list.length ? list : snippets,
        from: pos(line, start),
        to: pos(line, end)
      };

      return extraTooltip(cm, hint, Tooltip, data => {
        const lines = code.split('\n');

        lines[cursor.line] =
          lines[cursor.line].slice(0, cursor.ch) +
          data.text +
          lines[cursor.line].slice(cursor.ch);

        changeRenderedCode(lines.join('\n'));
        // MARK: uncomment next line to see code in tooltip
        // return data;
      });
    }
  });
};

export default showSnippets;
