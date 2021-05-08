import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
@customElement('wc-foo')
export class FooComponent extends LitElement {
  static styles = css`
    p {
      color: red;
    }
  `;
  @property()
  name = 'Somebody';
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
