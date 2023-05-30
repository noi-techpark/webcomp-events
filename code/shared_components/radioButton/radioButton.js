// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css, html, LitElement, unsafeCSS } from 'lit-element';
import TickWhiteIcon from '../assets/tick-white.svg';
import style from './radioButton.scss';

export class RadioButton extends LitElement {
  constructor() {
    super();
    this.name = '';
    this.value = '';
    this.options = [];
    this.action = (value) => {
      console.log(value);
    };
  }

  static get properties() {
    return {
      name: { type: String },
      action: { type: Function },
      value: { type: Boolean },
      options: { type: Array }
    };
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  handleInputChange = (e) => {
    this.value = e.target.value;
    this.action({ value: this.value, name: e.target.name });
  };

  render() {
    return html`
      <div>
        ${this.options.map((o) => {
          return html`<label class="radioButton"
            >${o.label}
            <input type="radio" .name="${this.name}" @change=${this.handleInputChange} value=${o.value} />
            <span class="checkmark">
              <img src="${TickWhiteIcon}" alt="Tick white icon" />
            </span>
          </label> `;
        })}
      </div>
    `;
  }
}

customElements.get('wc-radiobutton') || customElements.define('wc-radiobutton', RadioButton);
