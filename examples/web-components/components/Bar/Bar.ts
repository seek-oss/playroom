import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
@customElement('wc-bar')
export class BarComponent extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;
  @property()
  name = 'Somebody';
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
