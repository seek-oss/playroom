import {
  positionToCursorOffset,
  cursorOffsetToPosition,
  formatCode,
  formatAndInsert,
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
      ch: 4,
    }; // Before the capital T

    expect(positionToCursorOffset(code, offset)).toEqual(4);
  });

  it('should work across multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    const offset = {
      line: 1,
      ch: 4,
    };

    expect(positionToCursorOffset(code, offset)).toEqual(10);
  });
});

describe('formatting code', () => {
  it('should handle one line', () => {
    const code = `<div><h1>Title</h1></div>`;
    expect(formatCode({ code, cursor: { line: 0, ch: 9 } })).toEqual({
      cursor: { line: 1, ch: 6 },
      code: `<div>\n  <h1>Title</h1>\n</div>\n`,
    });
  });

  it('should handle multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    expect(formatCode({ code, cursor: { line: 1, ch: 4 } })).toEqual({
      cursor: { line: 1, ch: 6 },
      code: `<div>\n  <h1>Title</h1>\n</div>\n`,
    });
  });

  it('should handle multiple lines with cursor at start of line', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    expect(formatCode({ code, cursor: { line: 1, ch: 0 } })).toEqual({
      cursor: { line: 1, ch: 0 },
      code: `<div>\n  <h1>Title</h1>\n</div>\n`,
    });
  });

  it('should handle multiple root level jsx elements', () => {
    const code = `<div><h1>Title</h1></div><div><h1>Title Two</h1></div>`;
    expect(formatCode({ code, cursor: { line: 0, ch: 34 } })).toEqual({
      cursor: { line: 4, ch: 6 },
      code: `<div>\n  <h1>Title</h1>\n</div>\n<div>\n  <h1>Title Two</h1>\n</div>\n`,
    });
  });
});

describe('format and insert', () => {
  it('should handle inserting one line into one line', () => {
    const snippet = '<span>added</span>';
    const code = `<div><h1>Title</h1></div>`;
    expect(
      formatAndInsert({ code, cursor: { line: 0, ch: 9 }, snippet })
    ).toEqual({
      cursor: { line: 2, ch: 22 },
      code: `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n`,
    });
  });

  it('should handle inserting multiple lines into multiple lines', () => {
    const snippet = '<span>\n  <strong>second</strong>\n</span>';
    const code = `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n`;
    expect(
      formatAndInsert({ code, cursor: { line: 2, ch: 15 }, snippet })
    ).toEqual({
      cursor: { line: 6, ch: 13 },
      code: `<div>\n  <h1>\n    <span>\n      added\n      <span>\n        <strong>second</strong>\n      </span>\n    </span>\n    Title\n  </h1>\n</div>\n`,
    });
  });

  it('should handle inserting at the start', () => {
    const snippet = '<span>\n  <strong>second</strong>\n</span>';
    const code = `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n`;
    expect(
      formatAndInsert({ code, cursor: { line: 0, ch: 0 }, snippet })
    ).toEqual({
      cursor: { line: 2, ch: 7 },
      code: `<span>\n  <strong>second</strong>\n</span>\n<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n`,
    });
  });

  it('should handle inserting at the end', () => {
    const snippet = '<span>\n  <strong>second</strong>\n</span>';
    const code = `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n`;
    expect(
      formatAndInsert({ code, cursor: { line: 5, ch: 0 }, snippet })
    ).toEqual({
      cursor: { line: 7, ch: 7 },
      code: `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n<span>\n  <strong>second</strong>\n</span>\n`,
    });
  });

  it('should handle inserting at the end after multiple new lines', () => {
    const snippet = '<span>\n  <strong>second</strong>\n</span>\n';
    const code = `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n\n\n\n`;
    expect(
      formatAndInsert({ code, cursor: { line: 8, ch: 0 }, snippet })
    ).toEqual({
      cursor: { line: 9, ch: 0 },
      code: `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n\n<span>\n  <strong>second</strong>\n</span>\n`,
    });
  });
});
