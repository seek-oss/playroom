/* eslint-disable */

import styles from './Playroom.less';

function matches(hint, typed, matchInMiddle) {
  if (matchInMiddle) return hint.indexOf(typed) >= 0;
  else return hint.lastIndexOf(typed, 0) == 0;
}

function elt(tagname, cls /*, ... elts*/) {
  var e = document.createElement(tagname);

  if (cls) e.className = cls;

  for (var i = 2; i < arguments.length; ++i) {
    var elt = arguments[i];
    if (typeof elt == 'string') elt = document.createTextNode(elt);
    e.appendChild(elt);
  }

  return e;
}

function makeTooltip(x, y, data) {
  const content = [
    elt('span', styles['description-tooltip-text'], data.description)
  ];

  if (data.required) {
    content.unshift(elt('span', styles['description-tooltip-required'], 'ⓘ'));
  }

  if (data.default !== null) {
    const value = elt(
      'span',
      styles['description-tooltip-default-value'],
      data.default
    );

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
        styles['description-tooltip-default'],
        elt('span', styles['description-tooltip-default-label'], 'Default:'),
        value
      )
    );
  }

  if (data.type !== null) {
    content.push(
      elt(
        'div',
        styles['description-tooltip-default'],
        elt('span', styles['description-tooltip-default-label'], 'Type:'),
        elt('span', styles['description-tooltip-default-value'], data.type)
      )
    );
  }

  const node = elt('div', styles['description-tooltip'], ...content);

  node.style.left = x + 'px';
  node.style.top = y + 'px';

  document.body.appendChild(node);
  return node;
}

function remove(node) {
  var p = node && node.parentNode;
  if (p) p.removeChild(node);
}

export default function getHints(cm, options) {
  const CodeMirror = cm.constructor;

  var tags = options && options.schemaInfo;
  var quote = (options && options.quoteChar) || '"';
  var matchInMiddle = options && options.matchInMiddle;
  if (!tags) return;
  var cur = cm.getCursor(),
    token = cm.getTokenAt(cur);
  if (token.end > cur.ch) {
    token.end = cur.ch;
    token.string = token.string.slice(0, cur.ch - token.start);
  }
  var inner = CodeMirror.innerMode(cm.getMode(), token.state);
  if (inner.mode.name != 'xml') return;
  var result = [],
    replaceToken = false,
    prefix;
  var tag = /\btag\b/.test(token.type) && !/>$/.test(token.string);
  var tagName = tag && /^\w/.test(token.string),
    tagStart;

  if (tagName) {
    var before = cm
      .getLine(cur.line)
      .slice(Math.max(0, token.start - 2), token.start);
    var tagType = /<\/$/.test(before)
      ? 'close'
      : /<$/.test(before)
      ? 'open'
      : null;
    if (tagType) tagStart = token.start - (tagType == 'close' ? 2 : 1);
  } else if (tag && token.string == '<') {
    tagType = 'open';
  } else if (tag && token.string == '</') {
    tagType = 'close';
  }

  if ((!tag && !inner.state.tagName) || tagType) {
    if (tagName) prefix = token.string;
    replaceToken = tagType;
    var cx = inner.state.context,
      curTag = cx && tags[cx.tagName];
    var childList = cx ? curTag && curTag.children : tags['!top'];
    if (childList && tagType != 'close') {
      for (var i = 0; i < childList.length; ++i)
        if (!prefix || matches(childList[i], prefix, matchInMiddle))
          result.push('<' + childList[i]);
    } else if (tagType != 'close') {
      // Component Identifier names
      for (var name in tags)
        if (
          tags.hasOwnProperty(name) &&
          name != '!top' &&
          name != '!attrs' &&
          (!prefix || matches(name, prefix, matchInMiddle))
        )
          result.push({
            text: '<' + name,
            description: tags[name].attrs.component_description
          });
    }
    if (
      cx &&
      (!prefix ||
        (tagType == 'close' && matches(cx.tagName, prefix, matchInMiddle)))
    )
      result.push('</' + cx.tagName + '>');
  } else {
    // Attribute completion
    var curTag = tags[inner.state.tagName],
      attrs = curTag && curTag.attrs;
    var globalAttrs = tags['!attrs'];
    if (!attrs && !globalAttrs) return;
    if (!attrs) {
      attrs = globalAttrs;
    } else if (globalAttrs) {
      // Combine tag-local and global attributes
      var set = {};
      for (var nm in globalAttrs)
        if (globalAttrs.hasOwnProperty(nm)) set[nm] = globalAttrs[nm];
      for (var nm in attrs) if (attrs.hasOwnProperty(nm)) set[nm] = attrs[nm];
      attrs = set;
    }
    if (token.type == 'string' || token.string == '=') {
      // A value
      var before = cm.getRange(
        CodeMirror.Pos(cur.line, Math.max(0, cur.ch - 60)),
        CodeMirror.Pos(
          cur.line,
          token.type == 'string' ? token.start : token.end
        )
      );
      var atName = before.match(/([^\s\u00a0=<>\"\']+)=$/),
        atValues;
      if (
        !atName ||
        !attrs.hasOwnProperty(atName[1]) ||
        !(atValues = attrs[atName[1]].values)
      )
        return;
      if (typeof atValues == 'function') atValues = atValues.call(this, cm); // Functions can be used to supply values for autocomplete widget
      if (token.type == 'string') {
        prefix = token.string;
        var n = 0;
        if (/['"]/.test(token.string.charAt(0))) {
          quote = token.string.charAt(0);
          prefix = token.string.slice(1);
          n++;
        }
        var len = token.string.length;
        if (/['"]/.test(token.string.charAt(len - 1))) {
          quote = token.string.charAt(len - 1);
          prefix = token.string.substr(n, len - 2);
        }
        if (n) {
          // an opening quote
          var line = cm.getLine(cur.line);
          if (line.length > token.end && line.charAt(token.end) == quote)
            token.end++; // include a closing quote
        }
        replaceToken = true;
      }
      for (var i = 0; i < atValues.length; ++i)
        if (!prefix || matches(atValues[i], prefix, matchInMiddle))
          result.push(quote + atValues[i] + quote);
    } else {
      // An attribute name
      if (token.type == 'attribute') {
        prefix = token.string;
        replaceToken = true;
      }
      for (var attr in attrs)
        if (
          attrs.hasOwnProperty(attr) &&
          attr !== 'component_description' &&
          (!prefix || matches(attr, prefix, matchInMiddle))
        )
          result.push({ text: attr, ...attrs[attr] });
    }
  }

  const obj = {
    list: result,
    from: replaceToken
      ? CodeMirror.Pos(cur.line, tagStart == null ? token.start : tagStart)
      : cur,
    to: replaceToken ? CodeMirror.Pos(cur.line, token.end) : cur
  };

  let tooltip = null;

  CodeMirror.on(obj, 'close', () => remove(tooltip));
  CodeMirror.on(obj, 'update', () => remove(tooltip));
  CodeMirror.on(obj, 'select', (cur, node) => {
    remove(tooltip);

    if (cur && cur.description) {
      tooltip = makeTooltip(
        node.parentNode.getBoundingClientRect().right + window.pageXOffset,
        node.getBoundingClientRect().top + window.pageYOffset,
        cur
      );
      tooltip.className += ' hint-doc';
    }
  });

  return obj;
}
