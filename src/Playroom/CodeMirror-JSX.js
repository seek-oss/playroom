/* eslint-disable new-cap */

import styles from './CodeMirror-JSX.less';

function matches(hint, typed, matchInMiddle) {
  if (matchInMiddle) {
    return hint.indexOf(typed) >= 0;
  }

  return hint.lastIndexOf(typed, 0) === 0;
}

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

  if (data.default !== null) {
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

  if (data.type !== null) {
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

export default function getHints(cm, options) {
  const CodeMirror = cm.constructor;

  const tags = options && options.schemaInfo;
  const matchInMiddle = options && options.matchInMiddle;
  let quote = (options && options.quoteChar) || '"';

  if (!tags) {
    return;
  }

  const cur = cm.getCursor(),
    token = cm.getTokenAt(cur);

  if (token.end > cur.ch) {
    token.end = cur.ch;
    token.string = token.string.slice(0, cur.ch - token.start);
  }

  const inner = CodeMirror.innerMode(cm.getMode(), token.state);

  if (inner.mode.name !== 'xml') {
    return;
  }

  const result = [];
  const tag = /\btag\b/.test(token.type) && !/>$/.test(token.string);
  const tagName = tag && /^\w/.test(token.string);

  let tagStart,
    tagType,
    replaceToken = false,
    prefix;

  if (tagName) {
    const before = cm
      .getLine(cur.line)
      .slice(Math.max(0, token.start - 2), token.start);
    tagType =
      (/<\/$/.test(before) && 'close') || (/<$/.test(before) && 'open') || null;

    if (tagType) {
      tagStart = token.start - (tagType === 'close' ? 2 : 1);
    }
  } else if (tag && token.string === '<') {
    tagType = 'open';
  } else if (tag && token.string === '</') {
    tagType = 'close';
  }

  if ((!tag && !inner.state.tagName) || tagType) {
    if (tagName) {
      prefix = token.string;
    }
    replaceToken = tagType;
    const cx = inner.state.context;
    const curTag = cx && tags[cx.tagName];
    const childList = cx ? curTag && curTag.children : tags['!top'];

    if (childList && tagType !== 'close') {
      for (let i = 0; i < childList.length; ++i) {
        if (!prefix || matches(childList[i], prefix, matchInMiddle)) {
          result.push(`<${childList[i]}`);
        }
      }
    } else if (tagType !== 'close') {
      // Component Identifier names
      for (const name in tags) {
        if (
          tags.hasOwnProperty(name) &&
          name !== '!top' &&
          name !== '!attrs' &&
          (!prefix || matches(name, prefix, matchInMiddle))
        ) {
          result.push({
            text: `<${name}`,
            description: tags[name].attrs.component_description
          });
        }
      }
    }
    if (
      cx &&
      (!prefix ||
        (tagType === 'close' && matches(cx.tagName, prefix, matchInMiddle)))
    ) {
      result.push(`</${cx.tagName}>`);
    }
  } else {
    // Attribute completion
    const curTag = tags[inner.state.tagName];
    let attrs = curTag && curTag.attrs;
    const globalAttrs = tags['!attrs'];
    if (!attrs && !globalAttrs) {
      return;
    }
    if (!attrs) {
      attrs = globalAttrs;
    } else if (globalAttrs) {
      // Combine tag-local and global attributes
      const set = {};
      for (const nm in globalAttrs) {
        if (globalAttrs.hasOwnProperty(nm)) {
          set[nm] = globalAttrs[nm];
        }
      }
      for (const nm in attrs) {
        if (attrs.hasOwnProperty(nm)) {
          set[nm] = attrs[nm];
        }
      }
      attrs = set;
    }
    if (token.type === 'string' || token.string === '=') {
      // A value
      const before = cm.getRange(
        CodeMirror.Pos(cur.line, Math.max(0, cur.ch - 60)),
        CodeMirror.Pos(
          cur.line,
          token.type === 'string' ? token.start : token.end
        )
      );
      const atName = before.match(/([^\s\u00a0=<>\"\']+)=$/);
      let atValues;
      if (
        !atName ||
        !attrs.hasOwnProperty(atName[1]) ||
        !(atValues = Array.isArray(attrs[atName[1]])
          ? attrs[atName[1]]
          : attrs[atName[1]].values)
      ) {
        return;
      }
      if (typeof atValues === 'function') {
        atValues = atValues.call(this, cm);
      } // Functions can be used to supply values for autocomplete widget
      if (token.type === 'string') {
        prefix = token.string;
        let n = 0;
        if (/['"]/.test(token.string.charAt(0))) {
          quote = token.string.charAt(0);
          prefix = token.string.slice(1);
          n++;
        }
        const len = token.string.length;
        if (/['"]/.test(token.string.charAt(len - 1))) {
          quote = token.string.charAt(len - 1);
          prefix = token.string.substr(n, len - 2);
        }
        if (n) {
          // an opening quote
          const line = cm.getLine(cur.line);
          if (line.length > token.end && line.charAt(token.end) === quote) {
            token.end++;
          } // include a closing quote
        }
        replaceToken = true;
      }
      for (let i = 0; i < atValues.length; ++i) {
        if (!prefix || matches(atValues[i], prefix, matchInMiddle)) {
          result.push(quote + atValues[i] + quote);
        }
      }
    } else {
      // An attribute name
      if (token.type === 'attribute') {
        prefix = token.string;
        replaceToken = true;
      }
      for (const attr in attrs) {
        if (
          attrs.hasOwnProperty(attr) &&
          attr !== 'component_description' &&
          (!prefix || matches(attr, prefix, matchInMiddle))
        ) {
          result.push({ text: attr, ...attrs[attr] });
        }
      }
    }
  }

  const obj = {
    list: result,
    from: replaceToken
      ? CodeMirror.Pos(
          cur.line,
          tagStart === null || typeof tagStart === 'undefined'
            ? token.start
            : tagStart
        )
      : cur,
    to: replaceToken ? CodeMirror.Pos(cur.line, token.end) : cur
  };

  let tooltip = null;

  CodeMirror.on(obj, 'close', () => remove(tooltip));
  CodeMirror.on(obj, 'update', () => remove(tooltip));
  CodeMirror.on(obj, 'select', (data, node) => {
    remove(tooltip);

    if (data && data.description) {
      tooltip = makeTooltip(
        node.parentNode.getBoundingClientRect().right + window.pageXOffset,
        node.getBoundingClientRect().top + window.pageYOffset,
        data
      );
      tooltip.className += ' hint-doc';
    }
  });

  // eslint-disable-next-line consistent-return
  return obj;
}
