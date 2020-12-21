import { LitElement, html, css, unsafeCSS } from 'lit-element';
import style from './checkBox.scss';
import TickWhiteIcon from '../assets/tick-white.svg';

export class CheckBox extends LitElement {
  constructor() {
    super();
    this.label = '- - -';
    this.name = '';
    this.value = false;
    this.action = (value) => {
      console.log(value);
    };
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      label: { type: String },
      name: { type: String },
      action: { type: Function },
      value: { type: Boolean }
    };
  }

  handleLabelClick = (e) => {
    this.value = e.target.checked;
    this.action({ value: this.value, name: e.target.name });
  };

  render() {
    return html`<label class="checkBox"
      >${this.label}
      <input type="checkbox" .name="${this.name}" @change=${this.handleLabelClick} .checked=${this.value} />
      <span class="checkmark">
        <img src="${TickWhiteIcon}" alt="Tick white icon" />
      </span>
    </label>`;
  }
}

customElements.get('wc-checkbox') || customElements.define('wc-checkbox', CheckBox);
