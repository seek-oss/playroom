import dedent from 'dedent';
import { isValidLocation } from './cursor';

const code = dedent`
  <a>
    <b />
    <c>
      <d>...</d>
      <e />
      ...
      <f>
        <g />
      </f>
      <h
        i="j"
      />
    </c>
  </a>`;

describe('cursor', () => {
  describe('isValidLocation', () => {
    describe('with cursor', () => {
      [
        {
          should: 'start of line after before component is valid',
          input: { code, cursor: { line: 1, ch: 0 } },
          output: true,
        },
        {
          should: 'end of line after component is valid',
          input: { code, cursor: { line: 1, ch: 7 } },
          output: true,
        },
        {
          should: 'middle of line inside component is valid',
          input: { code, cursor: { line: 3, ch: 7 } },
          output: true,
        },
        {
          should: 'middle of line inside tag is not valid',
          input: { code, cursor: { line: 3, ch: 5 } },
          output: false,
        },
        {
          should: 'start of line inside between attributes is not valid',
          input: { code, cursor: { line: 10, ch: 0 } },
          output: false,
        },
      ].forEach(({ should, input, output }) => {
        it(should, () => { // eslint-disable-line jest/valid-title
          expect(isValidLocation(input)).toEqual(output);
        });
      });
    });
  });
});
