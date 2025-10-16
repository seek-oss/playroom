import dedent from 'dedent';

import { isMac } from '../../src/utils/formatting';
import {
  typeCode,
  assertCodePaneContains,
  loadPlayroom,
  cmdPlus,
  selectNextWords,
  selectNextLines,
  selectNextCharacters,
  selectToStartOfLine,
  selectToEndOfLine,
  moveToEndOfLine,
  moveBy,
  moveByWords,
  assertCodePaneSearchMatchesCount,
  findInCode,
  replaceInCode,
  jumpToLine,
  jumpToCharacter,
} from '../support/utils';

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
      typeCode(`{rightArrow}${cmdPlusD}`);

      // Overwrite to check the selection
      typeCode('a');

      assertCodePaneContains(dedent`
        <a>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should select the next instance of the word on two uses', () => {
      typeCode(`{rightArrow}${cmdPlusD}${cmdPlusD}`);

      // Overwrite to check the selection
      typeCode('a');

      assertCodePaneContains(dedent`
        <a>First line</a>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should select the all instances of the word when spamming the key', () => {
      typeCode(`{rightArrow}${`${cmdPlusD}`.repeat(20)}`);

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

      typeCode(`${cmdPlusD}`.repeat(2));
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
      typeCode(`${cmdPlus('alt+downArrow')}a`);
      assertCodePaneContains(dedent`
        a<div>First line</div>
        a<div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should add a cursor on the previous line', () => {
      typeCode('{downArrow}{downArrow}');
      typeCode(`${cmdPlus('alt+upArrow')}a`);
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

    it("should insert a fragment with cursors when there's no selection", () => {
      typeCode(cmdPlus(`shift+,`));
      typeCode('a');

      assertCodePaneContains(dedent`
        <a></a><div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should wrap the selection when there is one', () => {
      selectToEndOfLine();

      typeCode(cmdPlus(`shift+,`));
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

      typeCode(cmdPlus(`shift+,`));
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

      typeCode(cmdPlus(`shift+,`));
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

      typeCode(cmdPlus(`shift+,`));
      typeCode('span');

      // Return to the start
      const moveToStart = isMac() ? '{cmd+upArrow}' : '{ctrl+home}';
      typeCode(moveToStart);

      // Select from the far left and try wrap
      typeCode('{downArrow}');
      typeCode('{shift+downArrow}'.repeat(2));

      typeCode(cmdPlus(`shift+,`));
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
      typeCode(cmdPlus(`alt+downArrow`));
      selectToEndOfLine();

      typeCode(cmdPlus(`shift+,`));
      typeCode('span');

      assertCodePaneContains(dedent`
        <span><div>First line</div></span>
        <span><div>Second line</div></span>
        <div>Third line</div>
      `);
    });

    it('should wrap a multi-cursor multi-line selection', () => {
      typeCode(cmdPlus(`alt+downArrow`));
      typeCode('{shift+alt+downArrow}{upArrow}');

      selectNextLines(1);
      selectToEndOfLine();

      typeCode(cmdPlus(`shift+,`));
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

    it('should wrap a two-line multi-line selection when the last selected line is empty', () => {
      loadPlayroom(`
        <div>First line</div>
      `);

      moveToEndOfLine();
      typeCode(`{enter}`);

      // Select all
      typeCode(cmdPlus('a'));

      typeCode(cmdPlus(`shift+,`));
      typeCode('a');

      assertCodePaneContains(dedent`
        <a>
          <div>First line</div>
        </a>\n
      `);
    });
  });

  describe('find and replace', () => {
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should find all occurrences of search term', () => {
      findInCode('div', { source: 'keyboard' });

      assertCodePaneSearchMatchesCount(6);

      cy.focused().type('{esc}');

      typeCode('c');

      assertCodePaneContains(dedent`
        <c>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });

    it('should replace and skip occurrences of search term correctly', () => {
      replaceInCode('div', 'span', { source: 'keyboard' });

      // replace occurrence
      cy.get('.CodeMirror-dialog button').contains('Yes').click();

      assertCodePaneContains(dedent`
        <span>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);

      // ignore occurrence
      cy.get('.CodeMirror-dialog button').contains('No').click();

      assertCodePaneContains(dedent`
        <span>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);

      // replace occurrence
      cy.get('.CodeMirror-dialog button').contains('Yes').click();

      assertCodePaneContains(dedent`
        <span>First line</div>
        <span>Second line</div>
        <div>Third line</div>
      `);

      // replace all remaining occurrences
      cy.get('.CodeMirror-dialog button').contains('All').click();

      assertCodePaneContains(dedent`
        <span>First line</span>
        <span>Second line</span>
        <span>Third line</span>
      `);

      typeCode('c');

      assertCodePaneContains(dedent`
        <span>First line</span>
        <span>Second line</spanc>
        <span>Third line</span>
      `);
    });

    it('should back out of replace correctly', () => {
      replaceInCode('div', null, { source: 'keyboard' });

      typeCode('{esc}');

      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);

      typeCode('c');

      assertCodePaneContains(dedent`
        c<div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
      `);
    });
  });

  describe('jump to line', () => {
    beforeEach(() => {
      loadPlayroom(`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
        <div>Forth line</div>
        <div>Fifth line</div>
        <div>Sixth line</div>
        <div>Seventh line</div>
      `);
    });

    it('should jump to line number correctly', () => {
      const line = 6;
      jumpToLine(line, { source: 'keyboard' });

      typeCode('c');

      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
        <div>Forth line</div>
        <div>Fifth line</div>
        c<div>Sixth line</div>
        <div>Seventh line</div>
      `);

      typeCode('{backspace}');

      const nextLine = 2;
      jumpToLine(nextLine, { source: 'keyboard' });

      typeCode('c');

      assertCodePaneContains(dedent`
        <div>First line</div>
        c<div>Second line</div>
        <div>Third line</div>
        <div>Forth line</div>
        <div>Fifth line</div>
        <div>Sixth line</div>
        <div>Seventh line</div>
      `);
    });

    it('should jump to line and column number correctly', () => {
      jumpToCharacter(6, 10);
      typeCode('a');

      assertCodePaneContains(dedent`
        <div>First line</div>
        <div>Second line</div>
        <div>Third line</div>
        <div>Forth line</div>
        <div>Fifth line</div>
        <div>Sixtha line</div>
        <div>Seventh line</div>
      `);
    });
  });

  describe('toggleComment', () => {
    const blockStarter = `
      <div>First line</div>
      <div>Second line</div>
      <div>Third line</div>`;

    const lineStarter = `
      <div
        prop1="This is the first prop"
        prop2="This is the second prop"
        prop3="This is the third prop"
      >
        First line
      </div>
      <div>Second line</div>
      <div>Third line</div>`;

    const executeToggleCommentCommand = () => typeCode(cmdPlus('/'));

    it('should create a comment when there is no code in the editor', () => {
      loadPlayroom('');
      executeToggleCommentCommand();

      assertCodePaneContains(dedent`
        {/*  */}
      `);

      typeCode('this is a comment');

      assertCodePaneContains(dedent`
        {/* this is a comment */}
      `);
    });

    describe('should wrap a single line in a comment when there is no selection', () => {
      it('block', () => {
        loadPlayroom(blockStarter);
        executeToggleCommentCommand();

        assertCodePaneContains(dedent`
          {/* <div>First line</div> */}
          <div>Second line</div>
          <div>Third line</div>
        `);
      });

      it('line', () => {
        loadPlayroom(lineStarter);

        moveBy(0, 1);

        executeToggleCommentCommand();

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

      it('line in callback', () => {
        loadPlayroom(`
          <button
            onClick={() =>
              getState("activeStep") > 1 &&
              setState("activeStep", getState("activeStep") - 1)
            }
          >
            Text
          </button>
        `);

        moveBy(0, 2);

        executeToggleCommentCommand();

        assertCodePaneContains(dedent`
          <button
            onClick={() =>
              // getState("activeStep") > 1 &&
              setState("activeStep", getState("activeStep") - 1)
            }
          >
            Text
          </button>
        `);
      });

      it('block - expression slot outside tags', () => {
        loadPlayroom(`
          {testFn('test')}
          <div>First line</div>
          <div>Second line</div>
          <div>Third line</div>
        `);

        executeToggleCommentCommand();

        assertCodePaneContains(dedent`
          {/* {testFn('test')} */}
          <div>First line</div>
          <div>Second line</div>
          <div>Third line</div>
        `);
      });

      it('line - inside multi-line expression slot outside tags', () => {
        loadPlayroom(`
          {
            testFn('test')
          }
          <div>First line</div>
          <div>Second line</div>
          <div>Third line</div>
        `);

        moveBy(0, 1);

        executeToggleCommentCommand();

        assertCodePaneContains(dedent`
          {
            // testFn('test')
          }
          <div>First line</div>
          <div>Second line</div>
          <div>Third line</div>
        `);
      });

      it('line - full line expression slot inside tags', () => {
        loadPlayroom(`
          <div
            prop1="prop1"
            {...props}
          >
            First line
          </div>
          <div>Second line</div>
          <div>Third line</div>
        `);

        moveBy(0, 2);

        executeToggleCommentCommand();

        assertCodePaneContains(dedent`
          <div
            prop1="prop1"
            // {...props}
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
          loadPlayroom(blockStarter);
          selectToEndOfLine();

          executeToggleCommentCommand();

          assertCodePaneContains(dedent`
            {/* <div>First line</div> */}
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          selectToEndOfLine();

          executeToggleCommentCommand();

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
          loadPlayroom(blockStarter);
          selectToEndOfLine();

          executeToggleCommentCommand();

          typeCode(`{shift+leftArrow}`);
          typeCode('c');

          assertCodePaneContains(dedent`
            {/* c> */}
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          moveByWords(1);
          selectToEndOfLine();

          executeToggleCommentCommand();

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
          loadPlayroom(blockStarter);

          moveToEndOfLine();
          selectToStartOfLine();

          executeToggleCommentCommand();

          typeCode(`{shift+rightArrow}`);
          typeCode('c');

          assertCodePaneContains(dedent`
            {/* <c */}
            <div>Second line</div>
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          moveToEndOfLine();

          // Todo - (1/2) Solve issue where Ubuntu does not select to the start of line
          // Todo - (2/2) with one trigger of the keybinding
          selectToStartOfLine();
          selectToStartOfLine();

          executeToggleCommentCommand();

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
          loadPlayroom(blockStarter);

          moveByWords(3);
          selectNextWords(2);

          executeToggleCommentCommand();

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
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          moveByWords(3);

          selectNextWords(2);

          executeToggleCommentCommand();

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

          executeToggleCommentCommand();
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
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          moveByWords(1);
          selectToEndOfLine();

          executeToggleCommentCommand();
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
          loadPlayroom(blockStarter);

          selectNextLines(3);

          executeToggleCommentCommand();

          assertCodePaneContains(dedent`
            {/* <div>First line</div>
            <div>Second line</div>
            <div>Third line</div> */}
          `);
        });

        it('line', () => {
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          selectNextLines(3);

          executeToggleCommentCommand();

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
          loadPlayroom(blockStarter);

          moveByWords(3);
          selectNextLines(1);

          executeToggleCommentCommand();

          assertCodePaneContains(dedent`
            {/* <div>First line</div>
            <div>Second line</div> */}
            <div>Third line</div>
          `);
        });

        it('line', () => {
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          moveByWords(4);
          selectNextLines(1);

          executeToggleCommentCommand();

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

          executeToggleCommentCommand();
          typeCode('c');

          assertCodePaneContains(dedent`
            <div>
              {/* <div>c line</div> */}
              <div>Third line</div>
            </div>
          `);
        });

        it('line', () => {
          loadPlayroom(lineStarter);

          moveBy(0, 1);
          moveByWords(4);
          selectNextLines(1);
          selectNextWords(1);

          executeToggleCommentCommand();
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
          describe('with the cursor proceeding the comment', () => {
            it('block', () => {
              loadPlayroom(`
                {/* <div>First line</div> */}
                <div>Second line</div>
                <div>Third line</div>
              `);
              executeToggleCommentCommand();

              assertCodePaneContains(dedent`
                <div>First line</div>
                <div>Second line</div>
                <div>Third line</div>
              `);
            });

            it('line', () => {
              loadPlayroom(lineStarter);

              moveBy(0, 1);
              executeToggleCommentCommand();

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

          describe('with the cursor during the opening comment syntax', () => {
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

              executeToggleCommentCommand();

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
              moveBy(1);

              executeToggleCommentCommand();

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

          describe('with the cursor within the comment', () => {
            it('block', () => {
              loadPlayroom(`
                {/* <div>First line</div> */}
                <div>Second line</div>
                <div>Third line</div>
              `);

              moveByWords(5);

              executeToggleCommentCommand();

              assertCodePaneContains(dedent`
                <div>First line</div>
                <div>Second line</div>
                <div>Third line</div>
              `);

              typeCode('c');

              assertCodePaneContains(dedent`
                <div>Firstc line</div>
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
              moveByWords(5);

              executeToggleCommentCommand();

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
                  prop1="Thisc is the first prop"
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

        describe('with partial internal selection', () => {
          it('block', () => {
            loadPlayroom(`
              {/* <div>First line</div> */}
              <div>Second line</div>
              <div>Third line</div>
            `);

            moveByWords(4);
            selectNextWords(2);
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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

        describe('with an external to internal selection', () => {
          it('block', () => {
            loadPlayroom(`
              {/* <div>First line</div> */}
              <div>Second line</div>
              <div>Third line</div>
            `);

            selectNextWords(5);
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

          describe('for a selection beginning during opening comment syntax', () => {
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

              executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

              executeToggleCommentCommand();

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

        describe('should preserve secondary comments at the end of the line', () => {
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

            executeToggleCommentCommand();

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

            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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
            executeToggleCommentCommand();

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

        describe('with an external to internal selection that spans all lines of the comment', () => {
          it('block', () => {
            loadPlayroom(`
            {/* <div>First line</div>
            <div>Second line</div>
            <div>Third line</div> */}
          `);

            selectNextWords(5);
            selectNextLines(2);

            executeToggleCommentCommand();

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

            executeToggleCommentCommand();

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
