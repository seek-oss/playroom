/* eslint-disable new-cap */

import styles from './CodeMirror-JSX.less';

function elt(tagname, cls) {
  const e = document.createElement(tagname);

  if (cls) {
    e.className = cls;
  }

  for (let i = 2; i < arguments.length; ++i) {
    let element = arguments[i];

    if (typeof element === 'string') {
      element = document.createTextNode(element);
    }

    e.appendChild(element);
  }

  return e;
}

function makeTooltip(x, y, data) {
  const content = [elt('span', null, data.description)];

  if (data.required) {
    content.unshift(elt('span', styles.required, 'ⓘ'));
  }

  if (data.default !== null && typeof data.default !== 'undefined') {
    const value = elt('span', null, data.default);

    if (data.type === 'boolean') {
      value.style.color = 'rebeccapurple';
    }

    if (data.type === 'string' || data.values.length > 0) {
      value.style.color = 'darkred';
    }

    if (data.type === 'number') {
      value.style.color = 'steelblue';
    }

    content.push(
      elt(
        'div',
        styles.default,
        elt('span', styles.defaultLabel, 'Default:'),
        value
      )
    );
  }

  if (data.type !== null && typeof data.type !== 'undefined') {
    content.push(
      elt(
        'div',
        styles.default,
        elt('span', styles.defaultLabel, 'Type:'),
        elt('span', null, data.type)
      )
    );
  }

  const node = elt('div', styles.tooltip, ...content);

  node.style.left = `${x}px`;
  node.style.top = `${y}px`;

  document.body.appendChild(node);
  return node;
}

function remove(node) {
  const p = node && node.parentNode;

  if (p) {
    p.removeChild(node);
  }
}

function prepareSchema(tags) {
  return Object.keys(tags).reduce((all, tag) => {
    all[tag] = {
      ...tags[tag],
      attrs: Object.keys(tags[tag].attrs).reduce((allAttrs, attr) => {
        allAttrs[attr] = tags[tag].attrs[attr].values;
        return allAttrs;
      }, {})
    };

    return all;
  }, {});
}

export default function getHints(cm, options) {
  const CodeMirror = cm.constructor;
  const tags = options && options.schemaInfo;
  const hint = CodeMirror.hint.xml(
    cm,
    Object.assign({}, options, {
      schemaInfo: prepareSchema(tags)
    })
  );

  let tooltip = null;

  CodeMirror.on(hint, 'close', () => remove(tooltip));
  CodeMirror.on(hint, 'update', () => remove(tooltip));
  CodeMirror.on(hint, 'select', (data, node) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);

    if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    const inner = CodeMirror.innerMode(cm.getMode(), token.state);
    let attr;

    // Attribute
    if (tags[inner.state.tagName]) {
      attr = tags[inner.state.tagName].attrs[data];
    }

    // Tag
    if (data.match(/<\S+/)) {
      attr = {
        description: tags[data.slice(1)].attrs.component_description
      };
    }

    remove(tooltip);

    if (attr && attr.description) {
      tooltip = makeTooltip(
        node.parentNode.getBoundingClientRect().right + window.pageXOffset,
        node.getBoundingClientRect().top + window.pageYOffset,
        attr
      );
      tooltip.className += ' hint-doc';
    }
  });

  return hint;
}
