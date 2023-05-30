// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
