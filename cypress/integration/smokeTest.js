import dedent from 'dedent';
import {
  formatCode,
  typeCode,
  getFirstFrame,
  assertFirstFrameContains,
  assertCodePaneContains,
  assertCodePaneLineCount,
  assertFramesMatch,
  selectWidthPreferenceByIndex,
  selectSnippetByIndex,
  filterSnippets,
  toggleSnippets,
  assertSnippetCount,
  assertSnippetsListIsVisible,
  mouseOverSnippet,
  visit
} from '../support/utils';

describe('Smoke test', () => {
  it('renders to frame', () => {
    typeCode('<Foo />');
    assertFirstFrameContains('Foo');

    typeCode('<Bar />');
    assertFirstFrameContains('Foo\nBar');
  });

  it('autocompletes', () => {
    typeCode('<F{enter} c{enter}={downarrow}{enter} />');
    assertFirstFrameContains('Foo');
    assertCodePaneContains('<Foo color="blue" />');
  });

  it('formats', () => {
    typeCode('<Foo><Foo><Bar/>');
    assertCodePaneLineCount(1);
    formatCode();
    assertCodePaneLineCount(6);
  });

  it('frames are interactive', () => {
    getFirstFrame().click('center');
  });

  describe('url handling', () => {
    it('code (base64 encoding)', () => {
      visit(
        'http://localhost:9000/#?code=PEZvbz48Rm9vPjxCYXIvPjwvRm9vPjwvRm9vPg'
      );

      assertFirstFrameContains('Foo\nFoo\nBar');
      assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
    });

    it('code (LZ-based compression)', () => {
      visit(
        'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
      );

      assertFirstFrameContains('Foo\nFoo\nBar');
      assertCodePaneContains('<Foo><Foo><Bar/></Foo></Foo>');
    });

    it('widths', () => {
      visit(
        'http://localhost:9000/#?code=N4Ig7glgJgLgFgZxALgNoGYDsBWANJgNgA4BdAXyA'
      );

      assertFramesMatch(['375px', '768px']);
    });
  });

  describe('toolbar', () => {
    it('filter widths', () => {
      const frames = ['320px', '375px', '768px', '1024px'];
      const widthIndexToSelect = 1;

      assertFramesMatch(frames);
      selectWidthPreferenceByIndex(widthIndexToSelect);
      assertFramesMatch([frames[widthIndexToSelect]]);
    });

    it('copy to clipboard', () => {
      const copySpy = cy.spy();

      visit(
        'http://localhost:9000/#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
      );

      cy.document()
        .then(doc => {
          cy.stub(doc, 'execCommand', args => {
            if (args === 'copy') {
              copySpy();
              return true;
            }
          });
        })
        .get('[data-testid="copyToClipboard"]')
        .click()
        .then(() => expect(copySpy).to.have.been.called);
    });
  });

  describe('snippets', () => {
    beforeEach(() => typeCode('<div>Initial <span>code'));

    it('driven with mouse', () => {
      // Open and format for insertion point
      toggleSnippets();
      assertSnippetsListIsVisible();
      assertCodePaneLineCount(8);

      // Browse snippetlist
      assertSnippetCount(4);
      mouseOverSnippet(0);
      assertFirstFrameContains('Initial code\nFoo\nFoo');
      mouseOverSnippet(1);
      assertFirstFrameContains('Initial code\nFoo\nRed Foo');
      mouseOverSnippet(2);
      assertFirstFrameContains('Initial code\nBar\nBar');

      // Close without persisting
      toggleSnippets();
      assertCodePaneContains('<div>Initial <span>code</span></div>');
      assertCodePaneLineCount(1);

      // Re-open and persist
      toggleSnippets();
      mouseOverSnippet(3);
      assertFirstFrameContains('Initial code\nBar\nBlue Bar');
      selectSnippetByIndex(3).click();
      assertFirstFrameContains('Initial code\nBar\nBlue Bar');
      assertCodePaneLineCount(7);
      assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>
          </span>
        </div>\n
      `);
      typeCode('cursor position');
      assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>cursor position
          </span>
        </div>\n
      `);
    });

    it('driven with keyboard', () => {
      // Open and format for insertion point
      typeCode(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}i`);
      assertSnippetsListIsVisible();
      assertCodePaneLineCount(8);
      filterSnippets('{esc}');
      assertCodePaneLineCount(1);
      typeCode(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}p`);
      assertSnippetsListIsVisible();
      assertCodePaneLineCount(8);

      // Browse snippetlist
      assertSnippetCount(4);
      filterSnippets('{downarrow}');
      assertFirstFrameContains('Initial code\nFoo\nFoo');
      filterSnippets('{downarrow}');
      assertFirstFrameContains('Initial code\nFoo\nRed Foo');
      filterSnippets('{downarrow}');
      assertFirstFrameContains('Initial code\nBar\nBar');

      // Close without persisting
      filterSnippets('{esc}');
      assertCodePaneContains('<div>Initial <span>code</span></div>');
      assertCodePaneLineCount(1);

      // Re-open and persist
      typeCode(`${navigator.platform.match('Mac') ? '{cmd}' : '{ctrl}'}p`);
      filterSnippets('{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
      assertFirstFrameContains('Initial code\nBar\nBlue Bar');
      assertCodePaneLineCount(7);
      assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>
          </span>
        </div>\n
      `);
      typeCode('cursor position');
      assertCodePaneContains(dedent`
        <div>
          Initial{" "}
          <span>
            code<Bar color="blue">Blue Bar</Bar>cursor position
          </span>
        </div>\n
      `);
    });
  });
});
