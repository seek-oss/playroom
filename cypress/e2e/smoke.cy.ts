import {
  assertPreviewContains,
  getFrames,
  loadPlayroom,
} from '../support/utils';

describe('Smoke', () => {
  it('frames are interactive', () => {
    loadPlayroom();
    getFrames().first().click('center');
  });

  it('preview mode loads correctly', () => {
    cy.visit(
      'http://localhost:9000/preview#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    );

    assertPreviewContains('Foo\nFoo\nBar');
  });

  it('preview mode works with TypeScript components', () => {
    cy.visit(
      'http://localhost:9002/preview#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    );

    assertPreviewContains('Foo\nFoo\nBar');
  });
});
