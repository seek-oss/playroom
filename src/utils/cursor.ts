import { CursorPosition } from './../StoreContext/StoreContext';
import { validateCode } from './compileJsx';

const breakoutString = '<b>"b"</b>';

export const insertAtCursor = ({
  code,
  cursor,
  snippet,
}: {
  code: string;
  cursor: CursorPosition;
  snippet: string;
}) => {
  const { line, ch } = cursor;
  const testCode = code.split('\n');
  testCode[line] = `${testCode[line].slice(0, ch)}${snippet}${testCode[
    line
  ].slice(ch)}`;
  return testCode.join('\n');
};

export const isValidLocation = ({
  code,
  cursor,
}: {
  code: string;
  cursor: CursorPosition;
}) =>
  code.length === 0
    ? true
    : validateCode(
        insertAtCursor({
          code,
          cursor,
          snippet: breakoutString,
        })
      );
