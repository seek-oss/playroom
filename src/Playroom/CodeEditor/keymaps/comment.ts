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

function getCommentStartInfo(commentType: CommentType, fullContent: string) {
  const commentStart =
    commentType === 'block' ? BLOCK_COMMENT_START : LINE_COMMENT_START;

  const commentStartWithSpace = `${commentStart} `;
  const commentStartUsed =
    fullContent.indexOf(commentStartWithSpace) === -1
      ? commentStart
      : commentStartWithSpace;

  const commentStartIndex = fullContent.indexOf(commentStartUsed);

  return {
    commentStartUsed,
    commentStartIndex,
  };
}

function getSelectionPositionRelativeToCommentStart(
  selectionEndpoint: CodeMirror.Position,
  commentStartIndex: number,
  commentStartUsed: string
): 'before' | 'during' | 'after' {
  if (selectionEndpoint.ch < commentStartIndex) {
    return 'before';
  }

  if (selectionEndpoint.ch > commentStartIndex + commentStartUsed.length) {
    return 'after';
  }

  return 'during';
}

interface GetSelectionFromOffsetOptions {
  commentType: CommentType;
  isAlreadyCommented: boolean;
  fullContent: string;
  from: CodeMirror.Position;
}

function getSelectionFromOffset({
  commentType,
  isAlreadyCommented,
  fullContent,
  from,
}: GetSelectionFromOffsetOptions) {
  if (!isAlreadyCommented) {
    const totalLeadingWhitespace =
      fullContent.length - fullContent.trimStart().length;

    const fromPositionBeforeCodeStart = from.ch < totalLeadingWhitespace;

    if (fromPositionBeforeCodeStart) {
      return 0;
    }

    return commentType === 'block' ? BLOCK_COMMENT_OFFSET : LINE_COMMENT_OFFSET;
  }

  const { commentStartUsed, commentStartIndex } = getCommentStartInfo(
    commentType,
    fullContent
  );

  const fromPositionRelativeToCommentStart =
    getSelectionPositionRelativeToCommentStart(
      from,
      commentStartIndex,
      commentStartUsed
    );

  switch (fromPositionRelativeToCommentStart) {
    case 'before':
      return 0;
    case 'during':
      return commentStartIndex - from.ch;
    case 'after':
      return -commentStartUsed.length;
  }
}

interface GetSelectionToOffsetOptions {
  to: CodeMirror.Position;
  commentType: CommentType;
  isAlreadyCommented: boolean;
  isMultiLineSelection: boolean;
  fullContent: string;
}

function getSelectionToOffset({
  to,
  commentType,
  isAlreadyCommented,
  isMultiLineSelection,
  fullContent,
}: GetSelectionToOffsetOptions) {
  const commentOffset =
    commentType === 'block' ? BLOCK_COMMENT_OFFSET : LINE_COMMENT_OFFSET;

  if (isMultiLineSelection && commentType === 'block') {
    return 0;
  }

  const totalLeadingWhitespace =
    fullContent.length - fullContent.trimStart().length;
  const toPositionBeforeCodeStart = to.ch < totalLeadingWhitespace;

  if (!isAlreadyCommented) {
    if (!isMultiLineSelection && toPositionBeforeCodeStart) {
      return 0;
    }

    return commentOffset;
  }

  const { commentStartUsed, commentStartIndex } = getCommentStartInfo(
    commentType,
    fullContent
  );

  const toPositionRelativeToCommentStart =
    getSelectionPositionRelativeToCommentStart(
      to,
      commentStartIndex,
      commentStartUsed
    );

  switch (toPositionRelativeToCommentStart) {
    case 'before':
      return 0;
    case 'during':
      return commentStartIndex - to.ch;
    case 'after':
      return -commentOffset;
  }
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
  const isInlineComment = cm.getLine(from.line).trimStart().startsWith('//');

  if (isInlineComment) {
    return 'line';
  }

  if (
    (!isJavaScriptMode && !containsAttribute) ||
    containsTag ||
    isJavaScriptMode
  ) {
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
      fullContent,
      from,
    });

    const toOffset = getSelectionToOffset({
      to,
      commentType,
      isAlreadyCommented,
      isMultiLineSelection,
      fullContent,
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
          uncommentType === 'block'
            ? /\{\/\*\s?|\s?\*\/\}/g
            : /^(\s*)\/\/\s?/gm,
          uncommentType === 'block' ? '' : '$1'
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
