import type CodeMirror from 'codemirror';
import { type Editor, Pos } from 'codemirror';
import type { Selection } from './types';

const BLOCK_COMMENT_START = '{/*';
const BLOCK_COMMENT_END = '*/}';

const LINE_COMMENT_START = '//';

const BLOCK_COMMENT_OFFSET = BLOCK_COMMENT_START.length + 1;
const LINE_COMMENT_OFFSET = LINE_COMMENT_START.length + 1;

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
  commentType: CommentType;
  isAlreadyCommented: boolean;
  selectedLeadingWhitespace: number;
  fullContent: string;
  from: CodeMirror.Position;
}

function getSelectionFromOffset({
  commentType,
  isAlreadyCommented,
  selectedLeadingWhitespace,
  fullContent,
  from,
}: GetSelectionFromOffsetOptions) {
  if (!isAlreadyCommented) {
    // Todo - refactor
    const totalLeadingWhitespace =
      fullContent.length - fullContent.trimStart().length;

    const removeLeadingWhitespace = !(from.ch > totalLeadingWhitespace);

    const whitespaceToRemove = removeLeadingWhitespace
      ? selectedLeadingWhitespace
      : 0;

    return (
      whitespaceToRemove +
      (commentType === 'block' ? BLOCK_COMMENT_OFFSET : LINE_COMMENT_OFFSET)
    );
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

  const commentStart =
    commentType === 'block' ? BLOCK_COMMENT_START : LINE_COMMENT_START;

  const commentStartWithSpace = `${commentStart} `;

  const commentStartUsed =
    fullContent.indexOf(commentStartWithSpace) === -1
      ? commentStart
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
  commentType: CommentType;
  isAlreadyCommented: boolean;
  isMultiLineSelection: boolean;
}

function getSelectionToOffset({
  commentType,
  isAlreadyCommented,
  isMultiLineSelection,
}: GetSelectionToOffsetOptions) {
  const commentOffset =
    commentType === 'block' ? BLOCK_COMMENT_OFFSET : LINE_COMMENT_OFFSET;

  if (isMultiLineSelection && commentType === 'block') {
    return 0;
  }

  if (isAlreadyCommented) {
    return -commentOffset;
  }

  return commentOffset;
}

type CommentType = 'line' | 'block';

interface TagRange {
  from: CodeMirror.Position;
  to: CodeMirror.Position;
  multiLine: boolean;
  existingIndent: number;
  isAlreadyCommented: boolean;
  commentType: CommentType;
}

const determineCommentType = (
  cm: Editor,
  from: CodeMirror.Position
): CommentType => {
  const lineTokens = cm.getLineTokens(from.line);

  const containsTag = lineTokens.some((token) => token.type === 'tag');
  const containsAttribute = lineTokens.some(
    (token) => token.type === 'attribute'
  );

  const isJavaScriptMode = cm.getModeAt(from).name === 'javascript';

  if (containsTag || (!isJavaScriptMode && !containsAttribute)) {
    return 'block';
  }

  return 'line';
};

export const toggleComment = (cm: Editor) => {
  const newSelections: Selection[] = [];
  const tagRanges: TagRange[] = [];

  for (const range of cm.listSelections()) {
    const from = range.from();
    let to = range.to();

    if (to.line !== from.line && to.ch === 0) {
      to = new Pos(to.line - 1);
    }

    const commentType = determineCommentType(cm, from);

    const fullContent = cm.getRange(new Pos(from.line, 0), new Pos(to.line));
    const existingIndent = fullContent.length - fullContent.trimStart().length;

    const trimmedContent = fullContent.trim();

    const isAlreadyCommented =
      (trimmedContent.startsWith(BLOCK_COMMENT_START) &&
        trimmedContent.endsWith(BLOCK_COMMENT_END)) ||
      trimmedContent.startsWith(LINE_COMMENT_START);

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
      commentType,
    });

    const fromOffset = getSelectionFromOffset({
      commentType,
      isAlreadyCommented,
      selectedLeadingWhitespace,
      fullContent,
      from,
    });

    const toOffset = getSelectionToOffset({
      commentType,
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
        const uncommentType: CommentType = existingContent
          .trimStart()
          .startsWith(BLOCK_COMMENT_START)
          ? 'block'
          : 'line';

        const existingContentWithoutComment = existingContent.replace(
          uncommentType === 'block' ? /\{\/\*\s?|\s?\*\/\}/g : /\/\/\s?/g,
          ''
        );
        cm.replaceRange(
          existingContentWithoutComment,
          newRangeFrom,
          newRangeTo
        );
      } else if (range.commentType === 'block') {
        cm.replaceRange(
          `${BLOCK_COMMENT_START} ${existingContent} ${BLOCK_COMMENT_END}`,
          newRangeFrom,
          newRangeTo
        );
      } else if (range.multiLine) {
        const updatedContent = existingContent.replace(
          /^(\s*)/gm,
          `$1${LINE_COMMENT_START} `
        );
        cm.replaceRange(updatedContent, newRangeFrom, newRangeTo);
      } else {
        cm.replaceRange(
          `${LINE_COMMENT_START} ${existingContent}`,
          newRangeFrom,
          newRangeTo
        );
      }
    }

    cm.setSelections(newSelections);
  });
};
