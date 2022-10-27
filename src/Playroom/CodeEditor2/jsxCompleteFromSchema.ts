import { Completion, CompletionSource } from '@codemirror/autocomplete';
import { EditorState, Text } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { SyntaxNode } from '@lezer/common';

interface ComponentSpec {
  // The name of the component
  name: string;
  // When given, allows users to complete the given content strings
  // as plain text when at the start of the element.
  textContent?: readonly string[];
  // Props to suggest
  // Can either be just a plain string for props that can't have suggestions
  // attached to them, e.g. `id` or `onClose`
  props?: readonly (string | PropSpec)[];
  completion?: Partial<Completion>;
}

interface PropSpec {
  // The prop name.
  name: string;
  // Pre-defined values to complete for this prop.
  values?: readonly string[];
  // Provides extra fields to the
  // [completion](#autocompletion.Completion) object created for this
  // element
  completion?: Partial<Completion>;
}

function tagName(doc: Text, tag: SyntaxNode | null) {
  const name = tag?.getChild('TagName');

  return name ? doc.sliceString(name.from, name.to) : '';
}

function elementName(doc: Text, tree: SyntaxNode | null) {
  const tag = tree?.firstChild;

  return !tag || tag.name !== 'OpenTag' ? '' : tagName(doc, tag);
}

function attrName(doc: Text, tag: SyntaxNode | null, pos: number) {
  const attr = tag
    ?.getChildren('JSXAttribute')
    .find((a) => a.from <= pos && a.to >= pos);
  const name = attr?.getChild('AttributeName');

  return name ? doc.sliceString(name.from, name.to) : '';
}

function findParentElement(tree: SyntaxNode | null) {
  for (let cur = tree?.parent; cur; cur = cur.parent) {
    if (cur.name === 'JSXElement') {
      return cur;
    }
  }

  return null;
}

type Location = {
  type: 'openTag' | 'closeTag' | 'attrValue' | 'attrName' | 'tag';
  from: number;
  context: SyntaxNode | null;
};

function findLocation(state: EditorState, pos: number): Location | null {
  let currentNode = syntaxTree(state).resolveInner(pos, -1);
  let inTag: SyntaxNode | null = null;

  for (let cur = currentNode; !inTag && cur.parent; cur = cur.parent) {
    if (
      cur.name === 'JSXOpenTag' ||
      cur.name === 'JSXCloseTag' ||
      cur.name === 'JSXSelfClosingTag' ||
      // Don't know if this exists in the JSX syntax tree
      cur.name === 'MismatchedCloseTag'
    ) {
      inTag = cur;
    }
  }
  console.log({ currentNodeName: currentNode.name, inTagName: inTag?.name });

  if (inTag && (inTag.to > pos || inTag.lastChild!.type.isError)) {
    const parent = inTag.parent!;

    if (currentNode.name === 'JSXIdentifier') {
      return inTag.name ===
        'JSXCloseTag' /*  || inTag.name === 'MismatchedCloseTag' */
        ? { type: 'closeTag', from: currentNode.from, context: parent }
        : {
            type: 'openTag',
            from: currentNode.from,
            context: findParentElement(parent),
          };
    }

    if (currentNode.name === 'JSXAttribute') {
      return { type: 'attrName', from: currentNode.from, context: inTag };
    }

    if (currentNode.name === 'JSXAttributeValue') {
      return { type: 'attrValue', from: currentNode.from, context: inTag };
    }

    const before =
      currentNode === inTag || currentNode.name === 'JSXAttribute'
        ? currentNode.childBefore(pos)
        : currentNode;

    console.log({ beforeName: before?.name });

    if (before?.name === 'JSXOpenTag') {
      const context = findParentElement(parent);
      console.log('jsxopentag', context);
      return { type: 'openTag', from: pos, context };
    }

    if (before?.name === 'JSXStartCloseTag' && before.to <= pos) {
      return { type: 'closeTag', from: pos, context: parent };
    }

    // if (before?.name === 'Is') {
    //   return { type: 'attrValue', from: pos, context: inTag };
    // }

    if (before) {
      return { type: 'attrName', from: pos, context: inTag };
    }

    return null;
  } else if (currentNode.name === 'StartCloseTag') {
    return { type: 'closeTag', from: pos, context: currentNode.parent! };
  }

  if (currentNode.name === 'JSXStartTag') {
    return { type: 'openTag', from: pos, context: null };
  }

  while (
    currentNode.parent &&
    currentNode.to === pos &&
    !currentNode.lastChild?.type.isError
  ) {
    currentNode = currentNode.parent;
  }

  if (
    currentNode.name === 'JSXElement' ||
    currentNode.name === 'Text' ||
    currentNode.name === 'Document'
  ) {
    return {
      type: 'tag',
      from: pos,
      context:
        currentNode.name === 'JSXElement'
          ? currentNode
          : findParentElement(currentNode),
    };
  }

  return null;
}

class Component {
  name: string;
  completion: Completion;
  openCompletion: Completion;
  closeCompletion: Completion;
  closeNameCompletion: Completion;
  // children: Component[] = [];
  text: Completion[];

  constructor(
    spec: ComponentSpec,
    readonly attrs: readonly Completion[],
    readonly attrValues: { [name: string]: readonly Completion[] }
  ) {
    this.name = spec.name;
    this.completion = {
      type: 'type',
      ...(spec.completion || {}),
      label: this.name,
    };
    this.openCompletion = { ...this.completion, label: `<${this.name}` };
    this.closeCompletion = {
      ...this.completion,
      label: `</${this.name}>`,
      boost: 2,
    };
    this.closeNameCompletion = {
      ...this.completion,
      label: `${this.name}>`,
    };
    this.text = spec.textContent
      ? spec.textContent.map((s) => ({ label: s, type: 'text' }))
      : [];
  }
}

const Identifier = /^[:\-\.\w\u00b7-\uffff]*$/;

function propCompletion(spec: PropSpec): Completion {
  return { type: 'property', ...(spec.completion || {}), label: spec.name };
}

function valueCompletion(spec: string | Completion): Completion {
  if (typeof spec === 'string') {
    return { label: `"${spec}"`, type: 'constant' };
  }

  if (/^"/.test(spec.label)) {
    return spec;
  }

  return { ...spec, label: `"${spec.label}"` };
}

// Create a completion source for the given schema.
export function jsxCompletionFromSchema(
  componentSpecs: readonly ComponentSpec[],
  propSpecs: readonly PropSpec[]
): CompletionSource {
  const allProps: Completion[] = [];
  // const globalProps: Completion[] = [];
  const propValues: { [name: string]: readonly Completion[] } = Object.create(
    null
  );

  for (const prop of propSpecs) {
    const completion = propCompletion(prop);
    allProps.push(completion);

    // if (prop.global) {
    //   globalProps.push(completion);
    // }

    if (prop.values) {
      propValues[prop.name] = prop.values.map(valueCompletion);
    }
  }

  const allComponents: Component[] = [];
  // let topElements: Component[] = [];

  const byName: { [name: string]: Component } = Object.create(null);

  for (const component of componentSpecs) {
    let props: Completion[] = [];
    let propVals = propValues;

    if (component.props) {
      props = props.concat(
        component.props.map((prop) => {
          if (typeof prop === 'string') {
            return (
              allProps.find((p) => p.label === prop) || {
                label: prop,
                type: 'property',
              }
            );
          }

          if (prop.values) {
            // This should be a deep equals right?
            if (propVals === propValues) {
              propVals = Object.create(propVals);
            }
            propVals[prop.name] = prop.values.map(valueCompletion);
          }

          return propCompletion(prop);
        })
      );
    }

    const comp = new Component(component, props, propVals);
    byName[comp.name] = comp;
    allComponents.push(comp);

    // if (component.top) {
    //   topElements.push(elt);
    // }
  }

  // if (!topElements.length) {
  //   topElements = allElements;
  // }

  // for (let i = 0; i < allElements.length; i++) {
  //   const s = componentSpecs[i],
  //     elt = allElements[i];
  //
  //   if (s.children) {
  //     for (const ch of s.children) {
  //       if (byName[ch]) {
  //         elt.children.push(byName[ch]);
  //       }
  //     }
  //   } else {
  //     elt.children = allElements;
  //   }
  // }

  return (cx) => {
    const { doc } = cx.state;
    const loc = findLocation(cx.state, cx.pos);

    if (!loc || (loc.type === 'tag' && !cx.explicit)) {
      return null;
    }

    const { type, from, context } = loc;
    console.log(`type: ${type}\nfrom: ${from}\ncontext: ${context}`);

    if (type === 'openTag') {
      // const parentName = elementName(doc, context);

      // if (parentName) {
      //   const parent = byName[parentName];
      //   children = parent?.children || allElements;
      // }

      return {
        from,
        options: allComponents.map((ch) => ch.completion),
        validFor: Identifier,
      };
    } else if (type === 'closeTag') {
      const parentName = elementName(doc, context);

      return parentName
        ? {
            from,
            to: cx.pos + (doc.sliceString(cx.pos, cx.pos + 1) === '>' ? 1 : 0),
            options: [
              byName[parentName]?.closeNameCompletion || {
                label: `${parentName}>`,
                type: 'type',
              },
            ],
            validFor: Identifier,
          }
        : null;
    } else if (type === 'attrName') {
      const parent = byName[tagName(doc, context)];

      return {
        from,
        options: parent?.attrs,
        validFor: Identifier,
      };
    } else if (type === 'attrValue') {
      const attr = attrName(doc, context, from);

      if (!attr) {
        return null;
      }

      const parent = byName[tagName(doc, context)];
      const values = (parent?.attrValues || propValues)[attr];

      if (!values || !values.length) {
        return null;
      }

      return {
        from,
        to: cx.pos + (doc.sliceString(cx.pos, cx.pos + 1) === '"' ? 1 : 0),
        options: values,
        validFor: /^"[^"]*"?$/,
      };
    } else if (type === 'tag') {
      const parentName = elementName(doc, context);
      const parent = byName[parentName];
      const closing = [];
      const last = context?.lastChild;

      if (
        parentName &&
        (!last ||
          last.name !== 'JSXCloseTag' ||
          tagName(doc, last) !== parentName)
      ) {
        closing.push(
          parent
            ? parent.closeCompletion
            : { label: `</${parentName}>`, type: 'type', boost: 2 }
        );
      }

      let options = closing.concat(
        allComponents.map((component) => component.openCompletion)
        // (parent?.children || (context ? allElements : topElements)).map(
        //   (e) => e.openCompletion
        // )
      );

      if (context && parent?.text.length) {
        const openTag = context.firstChild!;

        if (
          openTag.to > cx.pos - 20 &&
          !/\S/.test(cx.state.sliceDoc(openTag.to, cx.pos))
        ) {
          options = options.concat(parent.text);
        }
      }

      return {
        from,
        options,
        validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/,
      };
    }

    return null;
  };
}
