import { getFirstFrame, loadPlayroom } from '../support/utils';

describe('Smoke', () => {
  it('frames are interactive', () => {
    loadPlayroom();
    getFirstFrame().click('center');
  });

  it('preview mode loads correctly', () => {
    cy.visit(
      'http://localhost:9000/preview#?code=N4Igxg9gJgpiBcIA8AxCEB8r1YEIEMAnAei2LUyXJxAF8g'
    )
      .get('body')
      .then((el) => expect(el.get(0).innerText).to.eq('Foo\nFoo\nBar'));
  });
});
