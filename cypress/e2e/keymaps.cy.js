import dedent from 'dedent';
import {
  typeCode,
  assertCodePaneContains,
  loadPlayroom,
  selectNextWords,
  selectNextLines,
  selectNextCharacters,
  selectToStartOfLine,
  selectToEndOfLine,
  moveToEndOfLine,
  moveBy,
  moveByWords,
} from '../support/utils';
import { isMac } from '../../src/utils/formatting';

const cmdPlus = (keyCombo) => {
  const platformSpecificKey = isMac() ? 'cmd' : 'ctrl';
  return `${platformSpecificKey}+${keyCombo}`;
};

describe('Keymaps', () => {
  beforeEach(() => {
    loadPlayroom(`
      <div>First line</div>
      <div>Second line</div>
      <div>Third line</div>
    `);
  });

  describe('swapLine', () => {
    it('should swap single lines up and down without a selection', () => {
      // Move the first line down
      typeCode('{alt+downArrow}');
      assertCodePaneContains(dedent`
        <div>Second line</div>
        <div>First line</div>
        <div>Third line</div>
      `);

      // Move the line back up
      typeCode('{alt+upArrow}');
      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);

      // Move the bottom line to the top
      typeCode('{downArrow}{downArrow}{alt+upArrow}{alt+upArrow}');
      assertCodePaneContains(dedent`
        <div>Third line</div>
        <div>First line</div>
        <div>Second line</div>
      `);
    });

    it('should swap single lines up and down with a selection', () => {
      typeCode('{rightArrow}');
      selectNextWords(1);

      // The q checks that the selection is maintained after a line shift
      typeCode('{alt+downArrow}q');

      assertCodePaneContains(dedent`
        <div>Second line</div>
        <q>First line</div>
        <div>Third line</div>
      `);
    });

    it('should swap multiple lines up and down with a selection', () => {
      typeCode('{rightArrow}');
      selectNextLines(1);
      selectNextCharacters(3);

      typeCode('{alt+downArrow}');

      assertCodePaneContains(dedent`
        <div>Third line</div>
        <div>First line</div>
        <div>Second line</div>
      `);

      // Check that the selection is maintained
      typeCode('a');

      assertCodePaneContains(dedent`
        <div>Third line</div>
        <a>Second line</div>
      `);
    });
  });

  describe('duplicateLine', () => {
    it('should duplicate single lines up and down', () => {
      // Duplicate the first line down
      typeCode('{shift+alt+downArrow}a');
      assertCodePaneContains(dedent`
        <div>First line</div>
        a<div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);

      // Duplicate the last line up
      typeCode('{downArrow}{downArrow}{leftArrow}');
      typeCode('{shift+alt+upArrow}a');
      assertCodePaneContains(dedent`
        <div>First line</div>
        a<div>First line</div>
        <div>Second line</div>
        a<div>Third line</div>
        <div>Third line</div>
      `);
    });
  });

  describe('selectNextOccurrence', () => {
    const cmdPlusD = cmdPlus('D');

    it('should select the current word on one use', () => {
      typeCode(`{rightArrow}{${cmdPlusD}}`);

      // Overwrite to check the selection
      typeCode('a');

      assertCodePaneContains(dedent`
        <a>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should select the next instance of the word on two uses', () => {
      typeCode(`{rightArrow}{${cmdPlusD}}{${cmdPlusD}}`);

      // Overwrite to check the selection
      typeCode('a');

      assertCodePaneContains(dedent`
        <a>First line</a>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should select the all instances of the word when spamming the key', () => {
      typeCode(`{rightArrow}${`{${cmdPlusD}}`.repeat(20)}`);

      // Overwrite to check the selection and that multiple cursors were created
      typeCode('span');

      assertCodePaneContains(dedent`
        <span>First line</span>
        <span>Second line</span>
        <span>Third line</span>
      `);
    });

    it("should select next occurrence in whole word mode when there's no selection", () => {
      typeCode('{rightArrow}'.repeat(3));

      typeCode(`{${cmdPlusD}}`.repeat(2));
      typeCode('span');

      assertCodePaneContains(dedent`
        <span>First line</span>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });
  });

  describe('addCursor', () => {
    it('should add a cursor on the next line', () => {
      typeCode(`{${cmdPlus('alt+downArrow')}}a`);
      assertCodePaneContains(dedent`
        a<div>First line</div>
        a<div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should add a cursor on the previous line', () => {
      typeCode('{downArrow}{downArrow}');
      typeCode(`{${cmdPlus('alt+upArrow')}}a`);
      assertCodePaneContains(dedent`
        <div>First line</div>
        a<div>Second line</div>
        a<div>Third line</div>
      `);
    });
  });

  describe('wrapTag', () => {
    const modifierKey = isMac() ? 'cmd' : 'ctrl';

    it("should insert a fragment with cursors when there's no selection", () => {
      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('a');

      assertCodePaneContains(dedent`
        <a></a><div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should wrap the selection when there is one', () => {
      selectToEndOfLine();

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('span');

      assertCodePaneContains(dedent`
        <span><div>First line</div></span>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should ignore surrounding whitespace when wrapping a single line selection', () => {
      typeCode(' ');
      typeCode('{leftArrow}');
      selectToEndOfLine();

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('span');

      assertCodePaneContains(dedent`
        <span> <div>First line</div></span>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should wrap a multi-line selection', () => {
      typeCode('{shift+downArrow}');
      selectToEndOfLine();

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('span');

      assertCodePaneContains(dedent`
        <span>
          <div>First line</div>
          <div>Second line</div>
        </span>
        <div>Third line</div>
      `);
    });

    it('should wrap a multi-line selection when selected from a different indent level', () => {
      // This is a replay of the previous test, to give us an indent level
      typeCode('{shift+downArrow}');
      selectToEndOfLine();

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('span');

      // Return to the start
      const moveToStart = isMac() ? '{cmd+upArrow}' : '{ctrl+home}';
      typeCode(moveToStart);

      // Select from the far left and try wrap
      typeCode('{downArrow}');
      typeCode('{shift+downArrow}'.repeat(2));

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('a');

      assertCodePaneContains(dedent`
        <span>
          <a>
            <div>First line</div>
            <div>Second line</div>
          </a>
        </span>
        <div>Third line</div>
      `);
    });

    it('should wrap a multi-cursor single-line selection', () => {
      typeCode(`{${modifierKey}+alt+downArrow}`);
      selectToEndOfLine();

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('span');

      assertCodePaneContains(dedent`
        <span><div>First line</div></span>
        <span><div>Second line</div></span>
        <div>Third line</div>
      `);
    });

    it('should wrap a multi-cursor multi-line selection', () => {
      typeCode(`{${modifierKey}+alt+downArrow}`);
      typeCode('{shift+alt+downArrow}{upArrow}');

      selectNextLines(1);
      selectToEndOfLine();

      typeCode(`{shift+${modifierKey}+,}`);
      typeCode('span');

      assertCodePaneContains(dedent`
        <span>
          <div>First line</div>
          <div>First line</div>
        </span>
        <span>
          <div>Second line</div>
          <div>Second line</div>
        </span>
        <div>Third line</div>
      `);
    });
  });

  // Todo - remove "only" when "wrapComment" is implemented
  describe.only('wrapComment', () => {
    const modifierKey = isMac() ? 'cmd' : 'ctrl';
    const typeComment = () => typeCode(`{${modifierKey}+/}`);

    // Todo - find word to indicate this is not for prop comments
    describe('should wrap a single line in a block comment when there is no selection', () => {
      it('standard', () => {
        typeComment();

        assertCodePaneContains(dedent`
        {/* <div>First line</div> */}
        <div>Second line</div>
        <div>Third line</div>
      `);
      });
    });

    // Todo - find word to indicate this is not for prop comments
    describe('should wrap a single line selection in a block comment', () => {
      it('standard', () => {
        selectToEndOfLine();

        typeComment();

        assertCodePaneContains(dedent`
        {/* <div>First line</div> */}
        <div>Second line</div>
        <div>Third line</div>
      `);
      });

      it('without shifting selection position for a forward selection ', () => {
        selectToEndOfLine();

        typeComment();

        typeCode(`{shift+leftArrow}`);
        typeCode('c');

        assertCodePaneContains(dedent`
        {/* c> */}
        <div>Second line</div>
        <div>Third line</div>
      `);
      });

      it('without shifting selection position for a backward selection ', () => {
        moveToEndOfLine();
        selectToStartOfLine();

        typeComment();

        typeCode(`{shift+rightArrow}`);
        typeCode('c');

        assertCodePaneContains(dedent`
        {/* <c */}
        <div>Second line</div>
        <div>Third line</div>
      `);
      });

      it('when the line is only partially selected', () => {
        moveByWords(3);

        selectNextWords(2);

        typeComment();

        assertCodePaneContains(dedent`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);
      });

      it('and respect indent levels', () => {
        loadPlayroom(`
          <div>
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          </div>
        `);

        moveBy(0, 1);
        selectToEndOfLine();

        typeComment();
        typeCode('c');

        assertCodePaneContains(dedent`
        <div>
          {/* c */}
          <div>Second line</div>
          <div>Third line</div>
        </div>
      `);
      });
    });

    // Todo - find word to indicate this is not for prop comments
    describe('should wrap a multi line selection in a block comment', () => {
      it('standard', () => {
        selectNextLines(3);

        typeComment();

        assertCodePaneContains(dedent`
        {/* <div>First line</div>
        <div>Second line</div>
        <div>Third line</div> */}
      `);
      });

      it('when the lines are only partially selected', () => {
        moveByWords(3);
        selectNextLines(1);

        typeComment();

        assertCodePaneContains(dedent`
          {/* <div>First line</div>
          <div>Second line</div> */}
          <div>Third line</div>
        `);
      });

      it('and respect indent levels', () => {
        loadPlayroom(`
          <div>
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          </div>
        `);

        moveBy(0, 1);
        moveByWords(4);
        selectNextLines(1);
        selectNextWords(1);

        typeComment();
        typeCode('c');

        assertCodePaneContains(dedent`
          <div>
            {/* <div>c line</div> */}
            <div>Third line</div>
          </div>
      `);
      });
    });

    // Todo - remove skip after implementation
    describe.only('should uncomment', () => {
      describe('a single line block comment', () => {
        it('with no selection', () => {
          loadPlayroom(`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);
          typeComment();

          assertCodePaneContains(dedent`
          <div>First line</div>
          <div>Second line</div>
          <div>Third line</div>
        `);
        });

        it('with partial internal selection', () => {
          loadPlayroom(`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);

          moveByWords(4);
          selectNextWords(2);
          typeComment();
          typeCode('c');

          assertCodePaneContains(dedent`
          <div>c</div>
          <div>Second line</div>
          <div>Third line</div>
        `);
        });

        it('with full external selection', () => {
          loadPlayroom(`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);
          selectToEndOfLine();
          typeComment();

          assertCodePaneContains(dedent`
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          typeCode('c');

          assertCodePaneContains(dedent`
          c
          <div>Second line</div>
          <div>Third line</div>
        `);
        });

        // Todo - come up with a better name for this
        it('with overlapping partial external selection', () => {
          loadPlayroom(`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);
          selectNextWords(5);
          typeComment();

          assertCodePaneContains(dedent`
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          typeCode('c');

          assertCodePaneContains(dedent`
            c line</div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        describe.only('should respect indentation', () => {
          it('for an external, partial selection', () => {
            loadPlayroom(`
            <div>
                {/* <div>First line</div> */}
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);
            moveBy(2, 1);
            selectNextWords(5);

            typeComment();

            assertCodePaneContains(dedent`
            <div>
                <div>First line</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);

            typeCode('c');

            assertCodePaneContains(dedent`
            <div>
              cFirst line</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
            `);
          });

          it('for an internal, partial selection', () => {
            loadPlayroom(`
            <div>
                {/* <div>First line</div> */}
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);
            moveBy(0, 1);
            moveByWords(5);
            selectNextWords(2);

            typeComment();

            assertCodePaneContains(dedent`
            <div>
                <div>First line</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);

            typeCode('c');

            assertCodePaneContains(dedent`
            <div>
                <div>c</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);
          });

          it('for an selection beginning during opening block comment syntax', () => {
            loadPlayroom(`
            <div>
                {/* <div>First line</div> */}
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);
            moveBy(0, 1);
            moveByWords(1);
            moveBy(1);
            selectNextWords(4);

            typeComment();

            assertCodePaneContains(dedent`
            <div>
                <div>First line</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);

            typeCode('c');

            assertCodePaneContains(dedent`
            <div>
                cFirst line</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);
          });
        });
      });

      describe('a multi line block comment', () => {
        it('with partial internal selection that spans all lines of the comment', () => {
          loadPlayroom(`
          {/* <div>First line</div>
          <div>Second line</div>
          <div>Third line</div> */}
        `);
          moveByWords(4);
          selectNextLines(2);
          typeComment();

          assertCodePaneContains(dedent`
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          typeCode('c');

          assertCodePaneContains(dedent`
            <div>cd line</div>
          `);
        });

        it('with full external selection that spans all lines of the comment', () => {
          loadPlayroom(`
          {/* <div>First line</div>
          <div>Second line</div>
          <div>Third line</div> */}
        `);
          selectNextLines(3);
          typeComment();

          assertCodePaneContains(dedent`
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        // Todo - come up with a better name for this
        it('with overlapping external partial selection that spans all lines of the comment', () => {
          loadPlayroom(`
          {/* <div>First line</div>
          <div>Second line</div>
          <div>Third line</div> */}
        `);
          selectNextWords(5);
          selectNextLines(2);

          typeComment();

          assertCodePaneContains(dedent`
            <div>First line</div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          typeCode('c');

          assertCodePaneContains(dedent`
            ce</div>
          `);
        });
      });
    });

    // Todo - rename this describe
    // Todo - remove skip after implementation
    // Todo - make these sub tests of the above describes
    describe.skip('prop comment tests ', () => {
      it('with no selection');
      it('with partial internal selection');
      it('with full external selection');
      it('with overlapping external partial selection');
    });
  });
});
