import type CodeMirror from 'codemirror';
import { type Editor, Pos } from 'codemirror';
import type { Selection } from './types';

const BLOCK_COMMENT_START = '{/*';
const BLOCK_COMMENT_END = '*/}';

const BLOCK_COMMENT_OFFSET = BLOCK_COMMENT_START.length + 1;
// const LINE_COMMENT_OFFSET = '// '.length;

interface IsReverseSelectionOptions {
  anchor: CodeMirror.Position;
  head: CodeMirror.Position;
}

function isReverseSelection({
  anchor,
  head,
}: IsReverseSelectionOptions): boolean {
  return (
    anchor.line > head.line ||
    (anchor.line === head.line && anchor.ch > head.ch)
  );
}

interface GetSelectionFromOffsetOptions {
  isAlreadyCommented: boolean;
  selectedLeadingWhitespace: number;
  fullContent: string;
  from: CodeMirror.Position;
}

function getSelectionFromOffset({
  isAlreadyCommented,
  selectedLeadingWhitespace,
  fullContent,
  from,
}: GetSelectionFromOffsetOptions) {
  if (!isAlreadyCommented) {
    return selectedLeadingWhitespace + BLOCK_COMMENT_OFFSET;
  }

  function getSelectionStatus(): 'full' | 'partial' | 'none' {
    if (from.ch < commentStartIndex) {
      return 'full';
    }
    if (from.ch > commentStartIndex + commentStartUsed.length) {
      return 'none';
    }
    return 'partial';
  }

  const commentStartWithSpace = `${BLOCK_COMMENT_START} `;

  const commentStartUsed =
    fullContent.indexOf(commentStartWithSpace) === -1
      ? BLOCK_COMMENT_START
      : commentStartWithSpace;

  const commentStartIndex = fullContent.indexOf(commentStartUsed);
  const selectionStatus = getSelectionStatus();

  switch (selectionStatus) {
    case 'none':
      return -commentStartUsed.length;
    case 'full':
      return 0;
    case 'partial':
      return commentStartIndex - from.ch;
  }
}

interface GetSelectionToOffsetOptions {
  isAlreadyCommented: boolean;
  isMultiLineSelection: boolean;
}

function getSelectionToOffset({
  isAlreadyCommented,
  isMultiLineSelection,
}: GetSelectionToOffsetOptions) {
  if (isMultiLineSelection) {
    return 0;
  }

  if (isAlreadyCommented) {
    return -BLOCK_COMMENT_OFFSET;
  }

  return BLOCK_COMMENT_OFFSET;
}

interface TagRange {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  multiLine: boolean;
  existingIndent: number;
  isAlreadyCommented: boolean;
}

const determineCommentType = (
  cm: Editor,
  from: CodeMirror.Position
): 'line' | 'block' => {
  if (cm.getModeAt(from).name === 'javascript') {
    return 'line';
  }

  const lineTokens = cm.getLineTokens(from.line);

  const containsTag = lineTokens.some((token) => token.type === 'tag');
  const containsAttribute = lineTokens.some(
    (token) => token.type === 'attribute'
  );

  if (containsAttribute && !containsTag) {
    return 'line';
  }

  return 'block';
};

export const wrapInComment = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: TagRange[] = [];

  for (const range of cm.listSelections()) {
    const from = range.from();
    let to = range.to();

    if (to.line !== from.line && to.ch === 0) {
      to = new Pos(to.line - 1);
    }

    const commentType = determineCommentType(cm, from);
    console.log('commentType: ', commentType);
    const fullContent = cm.getRange(new Pos(from.line, 0), new Pos(to.line));
    const existingIndent = fullContent.length - fullContent.trimStart().length;

    const trimmedContent = fullContent.trim();

    const isAlreadyCommented =
      trimmedContent.startsWith(BLOCK_COMMENT_START) &&
      trimmedContent.endsWith(BLOCK_COMMENT_END);

    const selectedContent = cm.getRange(from, to);
    const selectedLeadingWhitespace =
      selectedContent.length - selectedContent.trimStart().length;

    const isMultiLineSelection = to.line !== from.line;

    tagRanges.push({
      from,
      to,
      multiLine: isMultiLineSelection,
      existingIndent,
      isAlreadyCommented,
    });

    // Todo - change offset from BLOCK_COMMENT_OFFSET to LINE_COMMENT_OFFSET for prop comment

    const fromOffset = getSelectionFromOffset({
      isAlreadyCommented,
      selectedLeadingWhitespace,
      fullContent,
      from,
    });

    const toOffset = getSelectionToOffset({
      isAlreadyCommented,
      isMultiLineSelection,
    });

    const newSelectionRangeFrom = new Pos(from.line, from.ch + fromOffset);
    const newSelectionRangeTo = new Pos(to.line, to.ch + toOffset);

    const newSelection = isReverseSelection(range)
      ? { anchor: newSelectionRangeTo, head: newSelectionRangeFrom }
      : { anchor: newSelectionRangeFrom, head: newSelectionRangeTo };

    newSelections.push(newSelection);
  }

  cm.operation(() => {
    for (const range of [...tagRanges].reverse()) {
      const newRangeFrom = new Pos(range.from.line, range.existingIndent);
      const newRangeTo = new Pos(range.to.line);

      const existingContent = cm.getRange(newRangeFrom, newRangeTo);

      if (range.isAlreadyCommented) {
        const existingContentWithoutComment = existingContent.replace(
          /\{\/\*\s?|\s?\*\/\}/g,
          ''
        );
        cm.replaceRange(
          existingContentWithoutComment,
          newRangeFrom,
          newRangeTo
        );
      } else {
        cm.replaceRange(`{/* ${existingContent} */}`, newRangeFrom, newRangeTo);
      }
    }

    cm.setSelections(newSelections);
  });
};
