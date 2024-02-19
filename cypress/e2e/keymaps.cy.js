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
  describe('swapLine', () => {
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

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
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

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
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

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
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

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
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });
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
  describe.only('toggleComment', () => {
    // Todo - remove this before each and loadPlayroom at the start of every test
    // Todo - make the common beforeEach strings consts to be reused
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    const modifierKey = isMac() ? 'cmd' : 'ctrl';
    const typeComment = () => typeCode(`{${modifierKey}+/}`);

    describe('should wrap a single line in a comment when there is no selection', () => {
      it('block', () => {
        typeComment();

        assertCodePaneContains(dedent`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);
      });

      it('line', () => {
        loadPlayroom(`
          <div
            prop1="This is the first prop"
            prop2="This is the second prop"
            prop3="This is the third prop"
          >
            First line
          </div>
          <div>Second line</div>
          <div>Third line</div>
        `);

        moveBy(0, 1);

        typeComment();

        assertCodePaneContains(dedent`
          <div
            // prop1="This is the first prop"
            prop2="This is the second prop"
            prop3="This is the third prop"
          >
            First line
          </div>
          <div>Second line</div>
          <div>Third line</div>
        `);
      });
    });

    describe('should wrap a single line selection in a comment', () => {
      describe('standard', () => {
        it('block', () => {
          selectToEndOfLine();

          typeComment();

          assertCodePaneContains(dedent`
            {/* <div>First line</div> */}
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          selectToEndOfLine();

          typeComment();

          assertCodePaneContains(dedent`
            <div
              // prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });

      describe('without shifting selection position for a forward selection', () => {
        it('block', () => {
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

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          moveByWords(1);
          selectToEndOfLine();

          typeComment();

          typeCode(`{shift+leftArrow}`);
          typeCode('c');

          assertCodePaneContains(dedent`
            <div
              // c"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });

      describe('without shifting selection position for a backward selection', () => {
        it('block', () => {
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

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          moveToEndOfLine();
          selectToStartOfLine();

          typeComment();

          typeCode(`{shift+rightArrow}`);
          typeCode('c');

          assertCodePaneContains(dedent`
            <div
             c
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });

      describe('when the line is only partially selected', () => {
        it('block', () => {
          moveByWords(3);

          selectNextWords(2);

          typeComment();

          assertCodePaneContains(dedent`
            {/* <div>First line</div> */}
            <div>Second line</div>
            <div>Third line</div>
          `);

          typeCode('c');

          assertCodePaneContains(dedent`
            {/* <div>c</div> */}
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          moveByWords(3);

          selectNextWords(2);

          typeComment();

          assertCodePaneContains(dedent`
            <div
              // prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          typeCode('c');

          assertCodePaneContains(dedent`
            <div
              // prop1="c the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });

      describe('and respect indent levels', () => {
        it('block', () => {
          loadPlayroom(`
            <div>
              <div>First line</div>
              <div>Second line</div>
              <div>Third line</div>
            </div>
          `);

          moveBy(0, 1);
          moveByWords(1);
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

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          moveByWords(1);
          selectToEndOfLine();

          typeComment();
          typeCode('c');

          assertCodePaneContains(dedent`
            <div
              // c
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });
    });

    describe('should wrap a multi line selection in a comment', () => {
      describe('standard', () => {
        it('block', () => {
          selectNextLines(3);

          typeComment();

          assertCodePaneContains(dedent`
            {/* <div>First line</div>
            <div>Second line</div>
            <div>Third line</div> */}
          `);
        });

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          selectNextLines(3);

          typeComment();

          assertCodePaneContains(dedent`
            <div
              // prop1="This is the first prop"
              // prop2="This is the second prop"
              // prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });

      describe('when the lines are only partially selected', () => {
        it('block', () => {
          moveByWords(3);
          selectNextLines(1);

          typeComment();

          assertCodePaneContains(dedent`
            {/* <div>First line</div>
            <div>Second line</div> */}
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          moveByWords(4);
          selectNextLines(1);

          typeComment();

          assertCodePaneContains(dedent`
            <div
              // prop1="This is the first prop"
              // prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });

      describe('and respect indent levels', () => {
        it('block', () => {
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

        it('line', () => {
          loadPlayroom(`
            <div
              prop1="This is the first prop"
              prop2="This is the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

          moveBy(0, 1);
          moveByWords(4);
          selectNextLines(1);
          selectNextWords(1);

          typeComment();
          typeCode('c');

          assertCodePaneContains(dedent`
            <div
              // prop1="Thisc the second prop"
              prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);
        });
      });
    });

    describe('should uncomment', () => {
      describe('a single line comment', () => {
        describe('with no selection', () => {
          it('block', () => {
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

          it('line', () => {
            loadPlayroom(`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
            moveBy(0, 1);
            typeComment();

            assertCodePaneContains(dedent`
              <div
                // prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div
              c  // prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });

        describe('with partial internal selection', () => {
          it('block', () => {
            loadPlayroom(`
              {/* <div>First line</div> */}
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveByWords(4);
            selectNextWords(2);
            typeComment();

            assertCodePaneContains(dedent`
              <div>First line</div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div>c</div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });

          it('line', () => {
            loadPlayroom(`
              <div
                // prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveBy(0, 1);
            moveByWords(4);
            selectNextWords(2);
            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div
                prop1="c the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });

        describe('with full external selection', () => {
          it('block', () => {
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

          it('line', () => {
            loadPlayroom(`
              <div
                // prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveBy(0, 1);
            selectToEndOfLine();
            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div
              c
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });

        // Todo - come up with a better name for this
        describe('with overlapping partial external selection', () => {
          it('block', () => {
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

          it('line', () => {
            loadPlayroom(`
              <div
                // prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveBy(0, 1);
            selectNextWords(5);
            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div
              c is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });

        describe('should respect indentation', () => {
          describe('for an external, partial selection', () => {
            it('block', () => {
              loadPlayroom(`
                <div>
                    {/* <div>First line</div> */}
                  <div>Second line</div>
                  <div>Third line</div>
                </div>
              `);

              moveBy(0, 1);
              moveByWords(1);
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

            it('line', () => {
              loadPlayroom(`
                <div
                    // prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              moveBy(0, 1);
              moveByWords(1);

              selectNextWords(3);

              typeComment();

              assertCodePaneContains(dedent`
                <div
                    prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              typeCode('c');

              assertCodePaneContains(dedent`
                <div
                    cThis is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);
            });
          });

          describe('for an internal, partial selection', () => {
            it('block', () => {
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

            it('line', () => {
              loadPlayroom(`
                <div
                    // prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              moveBy(0, 1);
              moveByWords(4);
              selectNextWords(5);

              typeComment();

              assertCodePaneContains(dedent`
                <div
                    prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              typeCode('c');

              assertCodePaneContains(dedent`
                <div
                    prop1="c"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);
            });
          });

          describe('for an selection beginning during opening comment syntax', () => {
            it('block', () => {
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

            it('line', () => {
              loadPlayroom(`
                <div
                    // prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              moveBy(0, 1);
              moveByWords(1);
              moveBy(1);
              selectNextWords(3);

              typeComment();

              assertCodePaneContains(dedent`
                <div
                    prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              typeCode('c');

              assertCodePaneContains(dedent`
                <div
                    cThis is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);
            });
          });

          describe('for no selection', () => {
            it('block', () => {
              loadPlayroom(`
                <div>
                  {/* <div>First line</div> */}
                  <div>Second line</div>
                  <div>Third line</div>
                </div>
              `);

              moveBy(0, 1);
              moveByWords(1);

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
                  c<div>First line</div>
                  <div>Second line</div>
                  <div>Third line</div>
                </div>
              `);
            });

            it('line', () => {
              loadPlayroom(`
                <div
                  // prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              moveBy(0, 1);
              moveByWords(1);

              typeComment();

              assertCodePaneContains(dedent`
                <div
                  prop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              typeCode('c');

              assertCodePaneContains(dedent`
                <div
                  cprop1="This is the first prop"
                  prop2="This is the second prop"
                  prop3="This is the third prop"
                >
                  First line
                </div>
                <div>Second line</div>
                <div>Third line</div>
              `);
            });
          });
        });

        // Todo - fix failing test
        describe.only('should preserve secondary comments at the end of the line', () => {
          it('line', () => {
            loadPlayroom(`
              <div
                prop1="This is the first prop" // Prop1
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveBy(0, 1);

            typeComment();

            assertCodePaneContains(dedent`
              <div
                // prop1="This is the first prop" // Prop1
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop" // Prop1
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });
      });

      describe('a multi line comment', () => {
        describe('with partial internal selection that spans all lines of the comment', () => {
          it('block', () => {
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

          it('line', () => {
            loadPlayroom(`
              <div
                // prop1="This is the first prop"
                // prop2="This is the second prop"
                // prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveBy(0, 1);
            moveByWords(4);
            selectNextLines(2);
            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div
                prop1="cThis is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });

        describe('with full external selection that spans all lines of the comment', () => {
          it('block', () => {
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

          it('line', () => {
            loadPlayroom(`
              <div
                // prop1="This is the first prop"
                // prop2="This is the second prop"
                // prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveBy(0, 1);
            selectNextLines(3);
            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });

        // Todo - come up with a better name for this
        describe('with overlapping external partial selection that spans all lines of the comment', () => {
          it('block', () => {
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

          it('line', () => {
            loadPlayroom(`
            <div
              // prop1="This is the first prop"
              // prop2="This is the second prop"
              // prop3="This is the third prop"
            >
              First line
            </div>
            <div>Second line</div>
            <div>Third line</div>
          `);

            moveBy(0, 1);
            selectNextWords(5);
            selectNextLines(2);

            typeComment();

            assertCodePaneContains(dedent`
              <div
                prop1="This is the first prop"
                prop2="This is the second prop"
                prop3="This is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);

            typeCode('c');

            assertCodePaneContains(dedent`
              <div
              c is the third prop"
              >
                First line
              </div>
              <div>Second line</div>
              <div>Third line</div>
            `);
          });
        });
      });
    });
  });
});
