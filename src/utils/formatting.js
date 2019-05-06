import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babylon';

export const runPrettier = ({ code, cursorOffset }) => {
  try {
    return prettier.formatWithCursor(code, {
      cursorOffset,
      parser: 'babylon',
      plugins: [babylon]
    });
  } catch (e) {
    // Just a formatting error so we pass
    return null;
  }
};

export const positionToCursorOffset = (code, { line, ch }) => {
  return code.split('\n').reduce((pos, currLine, index) => {
    if (index < line) {
      return pos + currLine.length + 1;
    } else if (index === line) {
      return pos + ch;
    }
    return pos;
  }, 0);
};

export const cursorOffsetToPosition = (code, cursorOffset) => {
  const substring = code.slice(0, cursorOffset);
  const line = substring.split('\n').length - 1;
  const indexOfLastLine = substring.lastIndexOf('\n');

  return {
    line,
    ch: cursorOffset - indexOfLastLine - 1
  };
};

export const wrapJsx = code => `<>\n${code}\n</>`;

// Removes `<>\n`  and `\n</>` and unindents the two spaces due to the wrapping
export const unwrapJsx = code => code.replace(/\n {2}/g, '\n').slice(3, -5);

// Handles running prettier, ensuring multiple root level JSX values are valid
// by wrapping the code in <>{code}</> then finally removing the layer of indentation
// all while maintaining the cursor position.
export const formatCode = ({ code, cursor }) => {
  // Since we're automatically adding a line due to the wrapping we need to
  // remove one
  const WRAPPED_LINE_OFFSET = 1;
  // Since we are wrapping we need to "unindent" the cursor one level , i.e two spaces.
  const WRAPPED_INDENT_OFFSET = 2;

  const wrappedCode = wrapJsx(code);

  const currentCursorPosition = cursor
    ? positionToCursorOffset(wrappedCode, {
        line: cursor.line + WRAPPED_LINE_OFFSET,
        ch: cursor.ch
      })
    : 0;

  const formatResult = runPrettier({
    code: wrappedCode,
    cursorOffset: currentCursorPosition
  });

  const formattedCode = unwrapJsx(formatResult.formatted);

  const position = cursorOffsetToPosition(
    formatResult.formatted,
    formatResult.cursorOffset
  );

  return {
    formattedCode,
    line: position.line - WRAPPED_LINE_OFFSET,
    ch: position.ch - WRAPPED_INDENT_OFFSET
  };
};
