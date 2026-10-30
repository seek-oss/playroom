import {
  assertFirstFrameContains,
  assertInspectOverlayInFrame,
  getFrames,
  loadPlayroom,
  toggleInspectMode,
  typeCode,
} from '../support/utils';

// `instanceof` fails across realms, so duck-type the frame's rules
const collectSelectors = (rules: CSSRuleList): string[] =>
  Array.from(rules).flatMap((rule) => {
    if ('selectorText' in rule) {
      return [(rule as CSSStyleRule).selectorText];
    }
    if ('cssRules' in rule) {
      return collectSelectors((rule as CSSGroupingRule).cssRules);
    }
    return [];
  });

describe('Frame styles', () => {
  it('does not apply playroom global styles to frames', () => {
    loadPlayroom();
    typeCode('<Foo />');
    assertFirstFrameContains('Foo');

    toggleInspectMode({ source: 'button' });
    assertInspectOverlayInFrame();

    getFrames()
      .first()
      .its('0.contentDocument')
      .then((frameDocument: Document) => {
        const selectors = Array.from(frameDocument.styleSheets).flatMap(
          (sheet) => collectSelectors(sheet.cssRules),
        );

        // `html` and `body` aren't checked, as the fixture's FrameComponent styles them
        const rootSelectors = selectors.filter((selector) =>
          selector.includes(':root'),
        );

        expect(selectors).to.have.length.greaterThan(0);
        expect(rootSelectors).to.deep.equal([]);
      });
  });
});
