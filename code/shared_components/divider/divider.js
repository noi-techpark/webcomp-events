// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html, css, unsafeCSS } from 'lit-element';
import style from './divider.scss';

const dividerTypes = ['line', 'text'];

export class Divider extends LitElement {
  constructor() {
    super();
    this.type = dividerTypes[0];
    this.content = '';
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      type: { type: String },
      content: { type: String }
    };
  }

  render() {
    let classExist = dividerTypes.includes(this.type);
    return html`<span class="${classExist ? this.type : dividerTypes[0]}"
      >${this.type === dividerTypes[1] ? this.content : ''}</span
    >`;
  }
}

customElements.get('wc-divider') || customElements.define('wc-divider', Divider);
