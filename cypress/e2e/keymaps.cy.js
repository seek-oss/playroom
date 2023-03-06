import dedent from 'dedent';
import {
  typeCode,
  assertCodePaneContains,
  loadPlayroom,
  selectNextWords,
  selectLines,
  selectNextCharacters,
} from '../support/utils';

const cmdPlus = (keyCombo) => {
  const platformSpecificKey = navigator.platform.match('Mac') ? 'cmd' : 'ctrl';
  return `${platformSpecificKey}+${keyCombo}`;
};

describe('Keymaps', () => {
  beforeEach(() => {
    loadPlayroom();

    // The last closing div is automatically inserted by autotag
    typeCode(
      dedent`
      <div>First line</div>
      <div>Second line</div>
      <div>Third line
    `
    );

    // Reset the cursor to a reliable position at the beginning
    typeCode(`{${cmdPlus('upArrow')}}{${cmdPlus('leftArrow')}}`);
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
});
