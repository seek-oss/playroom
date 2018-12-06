import {
  positionToCursorOffset,
  cursorOffsetToPosition,
  formatCode
} from './formatting';

describe('cursor offset to position', () => {
  it('should work for one line', () => {
    const code = `<h1>Title</h1>`;
    const position = 4; // Before the capital T

    expect(cursorOffsetToPosition(code, position)).toEqual({ line: 0, ch: 4 });
  });

  it('should work across multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    const position = 10; // Before the capital T

    expect(cursorOffsetToPosition(code, position)).toEqual({ line: 1, ch: 4 });
  });
});

describe('position to cursor offset', () => {
  it('should work for one line', () => {
    const code = `<h1>Title</h1>`;
    const offset = {
      line: 0,
      ch: 4
    }; // Before the capital T

    expect(positionToCursorOffset(code, offset)).toEqual(4);
  });

  it('should work across multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    const offset = {
      line: 1,
      ch: 4
    };

    expect(positionToCursorOffset(code, offset)).toEqual(10);
  });
});

describe('formatting code', () => {
  it('should handle one line', () => {
    const code = `<div><h1>Title</h1></div>`;
    expect(formatCode({ code, cursor: { line: 0, ch: 9 } })).toEqual({
      line: 1,
      ch: 6,
      formattedCode: `<div>\n  <h1>Title</h1>\n</div>\n`
    });
  });

  it('should handle multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    expect(formatCode({ code, cursor: { line: 1, ch: 4 } })).toEqual({
      line: 1,
      ch: 6,
      formattedCode: `<div>\n  <h1>Title</h1>\n</div>\n`
    });
  });

  it('should handle multiple root level jsx elements', () => {
    const code = `<div><h1>Title</h1></div><div><h1>Title Two</h1></div>`;
    expect(formatCode({ code, cursor: { line: 0, ch: 34 } })).toEqual({
      line: 4,
      ch: 6,
      formattedCode: `<div>\n  <h1>Title</h1>\n</div>\n<div>\n  <h1>Title Two</h1>\n</div>\n`
    });
  });
});
