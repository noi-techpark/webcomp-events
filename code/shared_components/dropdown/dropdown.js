const { LitElement, html, unsafeCSS, css } = require('lit-element');
import styles from './dropdown.scss';
import chevronDownIcon from '../assets/chevron-down.svg';

export class Dropdown extends LitElement {
  constructor() {
    super();
    this.options = [];
    this.isOpen = false;
    this.clickListener = undefined;
    this.value = { value: '', label: 'Choose a value' };
    this.action = (value) => {
      console.log({ value });
    };
  }

  static get properties() {
    return {
      options: { type: Array },
      isOpen: { type: Boolean },
      action: { type: Function },
      value: { type: Object }
    };
  }

  static get styles() {
    return css`
      ${unsafeCSS(styles)}
    `;
  }

  clickOutsideListener = (e) => {
    if (e.target.tagName !== 'WC-DROPDOWn') {
      // this.isOpen = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.clickOutsideListener);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.clickOutsideListener);
    super.disconnectedCallback();
  }

  openDropdown() {
    this.isOpen = !this.isOpen;
  }

  handleClickOnListElement = (value) => {
    this.value = value;
    this.action(value);
    this.isOpen = false;
  };

  render() {
    const { value: sValue, label: sLabel } = this.value;
    return html`<div class="dropdown ${this.isOpen ? 'open' : ''} ${sValue ? 'hasValue' : ''}">
      <div class="dropdown_input" @click="${this.openDropdown}">
        <p class="dropdown_input__text">${this.value.label}</p>
        <div class="dropdown_input__chevronContainer">
          <img src="${chevronDownIcon}" alt="" />
        </div>
      </div>
      <div class="dropdown_menu">
        ${!this.options.length
          ? html`<div class="dropdown_menu__list_element empty">
              <p>- - -</p>
            </div>`
          : ''}
        ${this.options.map((o) => {
          const { value, label } = o;
          return html`<div
            class="dropdown_menu__list_element"
            @click="${() => {
              this.handleClickOnListElement(o);
            }}"
          >
            <p class="${sValue === value && sLabel === label ? 'selected' : ''}">${label}</p>
          </div>`;
        })}
      </div>
    </div>`;
  }
}

customElements.get('wc-dropdown') || customElements.define('wc-dropdown', Dropdown);
