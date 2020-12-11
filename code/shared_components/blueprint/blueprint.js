const { LitElement, html } = require('lit-element');

export class Dropdown extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
      ${unsafeCSS()}
    `;
  }

  static get properties() {
    return {};
  }

  render() {
    return html`<div>lol</div>`;
  }
}
