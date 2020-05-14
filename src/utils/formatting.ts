import prettier from 'prettier/standalone';
import babel from 'prettier/parser-babel';
import { CursorPosition } from './../StoreContext/StoreContext';
import { insertAtCursor } from './cursor';

export interface CodeWithCursor {
  code: string;
  cursor: CursorPosition;
}

export const runPrettier = ({
  code,
  cursorOffset,
}: {
  code: string;
  cursorOffset: number;
}) => {
  try {
    return prettier.formatWithCursor(code, {
      cursorOffset,
      parser: 'babel',
      plugins: [babel],
    });
  } catch (e) {
    // Just a formatting error so we pass
    return null;
  }
};

export const positionToCursorOffset = (
  code: string,
  { line, ch }: CursorPosition
) =>
  code.split('\n').reduce((pos, currLine, index) => {
    if (index < line) {
      return pos + currLine.length + 1;
    } else if (index === line) {
      return pos + ch;
    }
    return pos;
  }, 0);

export const cursorOffsetToPosition = (
  code: string,
  cursorOffset: number
): CursorPosition => {
  const substring = code.slice(0, cursorOffset);
  const line = substring.split('\n').length - 1;
  const indexOfLastLine = substring.lastIndexOf('\n');

  return {
    line,
    ch: cursorOffset - indexOfLastLine - 1,
  };
};

export const wrapJsx = (code: string) => `<>\n${code}\n</>`;

// Removes `<>\n`  and `\n</>` and unindents the two spaces due to the wrapping
export const unwrapJsx = (code: string) =>
  code.replace(/\n {2}/g, '\n').slice(3, -5);

// Handles running prettier, ensuring multiple root level JSX values are valid
// by wrapping the code in <>{code}</> then finally removing the layer of indentation
// all while maintaining the cursor position.
export const formatCode = ({
  code,
  cursor,
}: CodeWithCursor): CodeWithCursor => {
  // Since we're automatically adding a line due to the wrapping we need to
  // remove one
  const WRAPPED_LINE_OFFSET = 1;
  // Since we are wrapping we need to "unindent" the cursor one level , i.e two spaces.
  const WRAPPED_INDENT_OFFSET = 2;

  const wrappedCode = wrapJsx(code);

  const currentCursorPosition = positionToCursorOffset(wrappedCode, {
    line: cursor.line + WRAPPED_LINE_OFFSET,
    ch: cursor.ch,
  });

  const formatResult = runPrettier({
    code: wrappedCode,
    cursorOffset: currentCursorPosition,
  });

  if (formatResult === null) {
    // Return inputs if formatting error occurs.
    return {
      code,
      cursor,
    };
  }

  const formattedCode = unwrapJsx(formatResult.formatted);
  const position = cursorOffsetToPosition(
    formatResult.formatted,
    formatResult.cursorOffset
  );

  return {
    code: formattedCode,
    cursor: {
      line: position.line - WRAPPED_LINE_OFFSET,
      ch: position.ch === 0 ? 0 : position.ch - WRAPPED_INDENT_OFFSET,
    },
  };
};

export const formatAndInsert = ({
  code,
  cursor,
  snippet,
}: {
  code: string;
  cursor: CursorPosition;
  snippet: string;
}): CodeWithCursor => {
  const { line, ch } = cursor;
  const snippetLines = snippet.split('\n');
  const lastLineOfSnippet = snippetLines[snippetLines.length - 1];
  const updatedCursor =
    snippetLines.length === 1
      ? { line, ch: ch + lastLineOfSnippet.length }
      : {
          line: line + snippetLines.length - 1,
          ch: lastLineOfSnippet.length,
        };
  const newCode = insertAtCursor({
    code,
    cursor,
    snippet,
  });

  return formatCode({
    code: newCode,
    cursor: updatedCursor,
  });
};

export const formatForInsertion = ({
  code,
  cursor,
}: CodeWithCursor): CodeWithCursor => {
  const snippet =
    '<AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789 />';
  const { code: formattedCode, cursor: formattedCursor } = formatAndInsert({
    code,
    snippet,
    cursor,
  });

  return {
    code: formattedCode.replace(snippet, ''),
    cursor: formattedCursor,
  };
};
