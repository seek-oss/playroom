import { html, css, LitElement } from 'lit';

export class BarComponent extends LitElement {
  static get styles() {
    return css`
      p {
        color: red;
      }
    `;
  }

  static get properties() {
    return {
      name: { type: String },
    };
  }

  constructor() {
    super();
    this.name = 'Somebody';
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
customElements.define('wc-bar', BarComponent);
