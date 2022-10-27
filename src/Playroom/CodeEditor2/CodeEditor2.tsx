import React, { useEffect, useRef } from 'react';

import {
  keymap,
  lineNumbers,
  EditorView,
  gutter,
  drawSelection,
  highlightActiveLineGutter,
  KeyBinding,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
  cursorLineEnd,
  cursorLineStart,
  history,
  historyKeymap,
  selectLineEnd,
  selectLineStart,
} from '@codemirror/commands';
import {
  syntaxHighlighting,
  syntaxTree,
  foldGutter,
} from '@codemirror/language';
import { tagHighlighter, tags } from '@lezer/highlight';

import { javascript } from '@codemirror/lang-javascript';
import './CodeEditor2.css';
import { useDebouncedCallback } from 'use-debounce';
import {
  autocompletion,
  Completion,
  CompletionSource,
  pickedCompletion,
  startCompletion as startCompletion_,
} from '@codemirror/autocomplete';
import { SyntaxNode } from '@lezer/common';
import { jsxCompletionFromSchema } from './jsxCompleteFromSchema';

interface CodeEditor2Props {
  code?: string;
  onChange: (newCode: string) => void;
  previewCode?: string;
}

const applyTagCompletion = (
  view: EditorView,
  completion: Completion,
  from: number,
  to: number
) => {
  const cleanLabel = completion.label.slice(1);
  const newCursorPosition = from + cleanLabel.length + 2;

  view.dispatch({
    changes: { from, to, insert: `<${cleanLabel}></${cleanLabel}>` },
    selection: { anchor: newCursorPosition, head: newCursorPosition },
    annotations: [pickedCompletion.of(completion)],
  });
};

const applyPropCompletion = (
  view: EditorView,
  completion: Completion,
  from: number,
  to: number
) => {
  // but why tho?
  const realFrom = from - 2;
  const newCursorPosition = realFrom + completion.label.length;
  console.log('foo');

  console.log({ from, to, completion });
  view.dispatch({
    changes: { from: realFrom, to: realFrom, insert: completion.label },
    selection: { anchor: newCursorPosition, head: newCursorPosition },
    annotations: [pickedCompletion.of(completion)],
  });
};

const completions: CompletionSource[] = [
  (context) => {
    const word = context.matchBefore(/\<\w*/);

    if (!word) {
      return null;
    }

    if (word.from === word.to && !context.explicit) {
      return null;
    }

    return {
      from: word.from,
      validFor: /^\<\w*$/,
      options: [{ label: '<Accordion' }, { label: '<Box' }].map((option) => ({
        ...option,
        apply: applyTagCompletion,
      })),
    };
  },
  (context) => {
    // TODO: Re-implement https://codemirror.net/5/addon/hint/xml-hint.js if possible
    const currentNode = syntaxTree(context.state).resolveInner(context.pos, 0);

    console.log({ currentNode, to: currentNode.to });
    if (currentNode.type.name === 'JSXOpenTag') {
      return {
        from: currentNode.to + 1,
        validFor: /^\w*$/,
        options: [{ label: 'propName', apply: applyPropCompletion }],
      };
    }
    const leftNode = syntaxTree(context.state).resolveInner(context.pos, -1);
    const leftLeftNode = syntaxTree(context.state).resolveInner(
      context.pos - 1,
      -1
    );
    // TODO: Write down all the logic
    // Get the current node
    // Check current and previous nodes
    //

    const textForNode = (node: SyntaxNode) =>
      context.state.sliceDoc(node.from, node.to);

    const nodeInfo = (node: SyntaxNode | null | undefined) => {
      if (node) {
        return {
          name: node.name,
          text: textForNode(node),
        };
      }
    };

    // Seems like most of the time, left is more useful than current
    // Looking at both current and left will tell us whether we need to look further back to
    // leftLeft
    console.log({
      current: nodeInfo(currentNode),
      currentParent: nodeInfo(currentNode.parent),
      currentParentParent: nodeInfo(currentNode.parent?.parent),
      left: nodeInfo(leftNode),
      leftParent: nodeInfo(leftNode.parent),
      leftParentParent: nodeInfo(leftNode.parent?.parent),
      leftLeft: nodeInfo(leftLeftNode),
      leftLeftParent: nodeInfo(leftLeftNode.parent),
      leftLeftParentParent: nodeInfo(leftLeftNode.parent?.parent),
    });
    return null;
  },
];

const runOriginal = (run?: (view: EditorView) => boolean) => (
  view: EditorView
): boolean => {
  if (!run) {
    return false;
  }

  run(view);

  // Keep calling further handlers for the given key
  return false;
};

const startCompletion = (view: EditorView) => startCompletion_(view);

const debugNode = (view: EditorView) => {
  const selectionStart = view.state.selection.main.from;
  const currentNode = syntaxTree(view.state).resolveInner(selectionStart, 0);

  const textForNode = (node: SyntaxNode) =>
    view.state.sliceDoc(node.from, node.to);

  console.log(`text: ${textForNode(currentNode)}\ntype: ${currentNode.name}`);
  return true;
};

const completeIfInTag = (view: EditorView) => {
  const selectionStart = view.state.selection.main.from;
  const currentNode = syntaxTree(view.state).resolveInner(selectionStart, 0);

  const textForNode = (node: SyntaxNode) =>
    view.state.sliceDoc(node.from, node.to);

  if (currentNode.type.name === 'JSXOpenTag') {
    console.log({ something: 'foo' });
    return startCompletion(view);
  }

  console.log({
    currentText: textForNode(currentNode),
    type: currentNode.type,
  });
  return false;
};

const playroomKeymaps: KeyBinding[] = [
  {
    key: 'Alt-ArrowLeft',
    mac: 'Ctrl-ArrowLeft',
    run: cursorLineStart,
  },
  {
    key: 'Shift-Alt-ArrowRight',
    mac: 'Shift-Ctrl-ArrowRight',
    run: selectLineEnd,
  },
  {
    key: 'Alt-ArrowRight',
    mac: 'Ctrl-ArrowRight',
    run: cursorLineEnd,
  },
  {
    key: 'Shift-Alt-ArrowLeft',
    mac: 'Shift-Ctrl-ArrowLeft',
    run: selectLineStart,
  },
  {
    key: '<',
    run: runOriginal(startCompletion),
  },
  {
    key: '1',
    run: debugNode,
  },
  {
    key: 'Ctrl-Space',
    run: startCompletion_,
  },
  /* { */
  /*   key: ' ', */
  /*   run: runOriginal(completeIfInTag), */
  /* }, */
  /* { */
  /*   key: '=', */
  /*   run: runOriginal(completeIfInTag), */
  /* }, */
  // TODO: Complete if in tag when typing space or =
  // TODO: Complete the closing tag (based on the previous opening tag I guess) when typing a /
  // after a >
];

const customHighlighter = tagHighlighter([
  { tag: tags.tagName, class: 'cm-tag' },
  { tag: tags.keyword, class: 'cm-keyword' },
  { tag: tags.attributeName, class: 'cm-attribute' },
  { tag: tags.propertyName, class: 'cm-property' },
  { tag: tags.string, class: 'cm-string' },
  { tag: tags.atom, class: 'cm-atom' },
  { tag: tags.variableName, class: 'cm-variable' },
  { tag: tags.number, class: 'cm-number' },
]);

export const CodeEditor2 = ({ code, onChange }: CodeEditor2Props) => {
  const editor = useRef<HTMLDivElement>();

  const [debouncedChange] = useDebouncedCallback(
    (newCode: string) => onChange(newCode),
    100
  );

  const onChangeExtension = EditorView.updateListener.of((e) => {
    debouncedChange(e.state.doc.toString());
  });

  useEffect(() => {
    const state = EditorState.create({
      doc: code,
      extensions: [
        javascript({ jsx: true }),
        /* autoCloseTags, */
        syntaxHighlighting(customHighlighter),
        gutter({ renderEmptyElements: true }),
        lineNumbers(),
        foldGutter({
          openText: '-',
          closedText: '+',
          markerDOM: (open) => {
            const element = document.createElement('div');
            const classNameSuffix = open ? 'Close' : 'Open';
            const innerText = open ? '–' : '+';
            element.className = `cm-foldMarker${classNameSuffix}`;
            element.innerText = innerText;

            return element;
          },
        }),
        drawSelection({ drawRangeCursor: false }),
        highlightActiveLineGutter(),
        history(),
        keymap.of([...historyKeymap, ...playroomKeymaps]),
        onChangeExtension,
        autocompletion({
          override: [
            jsxCompletionFromSchema(
              [
                {
                  name: 'Foo',
                  props: [{ name: 'bar', values: ['bar1', 'bar2'] }],
                },
                {
                  name: 'Baz',
                  props: [
                    { name: 'tone', values: ['critical', 'positive'] },
                    'onClose',
                  ],
                },
              ],
              []
            ),
          ],
          optionClass: () => 'cm-autocomplete-option',
          icons: false,
          closeOnBlur: false,
          activateOnTyping: false,
        }),
      ],
    });
    const view = new EditorView({
      state,
      parent: editor.current,
    });

    return () => {
      view.destroy();
    };
  }, []);

  return <div className="code-editor" ref={editor} />;
};
