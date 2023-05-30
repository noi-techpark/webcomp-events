// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { css, html, LitElement, unsafeCSS } from 'lit-element';
import style from './searchBar.scss';

import SearchBlackIcon from '../assets/search-black.svg';
import FilterGrayIcon from '../assets/filter-gray.svg';
import XBlackIcon from '../assets/x-black.svg';

export class SearchBar extends LitElement {
  constructor() {
    super();
    this.searchValue = '';
    this.placeHolder = '';
    this.filtersNumber = 0;
    this.hideFilter = false;
    this.action = (value) => {
      console.log(value);
    };
    this.filtersAction = () => {
      console.log('--- default message ---');
    };
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      action: { type: Function },
      filtersAction: { type: Function },
      searchValue: { type: String },
      placeHolder: { type: String },
      filtersNumber: { type: Number },
      hideFilter: { type: Boolean }
    };
  }

  render() {
    return html`<div class="searchbar">
      <div class="searchbar__section_search_icon" @click="${this.focusSearchInput}">
        <img src="${SearchBlackIcon}" alt="" />
      </div>

      <div class="searchbar__section_input_search">
        <input
          id="searchInput"
          type="text"
          placeholder="${this.placeHolder}"
          .value=${this.searchValue}
          @keyup=${(e) => {
            this.searchValue = e.target.value;
            this.action(this.searchValue);
          }}
        />
      </div>

      <div class="searchbar__section_erase_field" @click="${this.eraseSearchFilter}">
        <img src="${XBlackIcon}" alt="erase_icon" />
      </div>

      ${!this.hideFilter
        ? html`<div class="searchbar__section_separator"></div>
            <div class="searchbar__section_filters">
              ${this.filtersNumber
                ? html`<div class="filterCounter" @click="${this.filtersAction}">${this.filtersNumber}</div>`
                : html`<img src="${FilterGrayIcon}" alt="filter_icon" @click="${this.filtersAction}" />`}
            </div>`
        : ''}
    </div>`;
  }

  eraseSearchFilter() {
    this.searchValue = '';
  }

  focusSearchInput() {
    const searchInput = this.shadowRoot.getElementById('searchInput');
    searchInput.focus();
  }
}

customElements.get('wc-searchbar') || customElements.define('wc-searchbar', SearchBar);
