import dedent from 'dedent';
import {
  typeCode,
  assertCodePaneContains,
  loadPlayroom,
  selectNextWords,
  selectLines,
  selectNextCharacters,
  selectToEndOfLine,
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
      selectLines(1);
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

      selectLines(1);
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
});
