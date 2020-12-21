import { LitElement, html, css, unsafeCSS } from 'lit-element';
import style from './button.scss';

const buttonTypes = ['primary', 'secondary', 'borderless', 'square', 'disabled'];

export class Button extends LitElement {
  constructor() {
    super();
    this.type = 'primary';
    this.content = '---';
    this.image = '';
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      type: { type: String },
      content: { type: String },
      image: { type: String }
    };
  }

  render() {
    let classExist = buttonTypes.includes(this.type);
    return html`<button class="${classExist ? this.type : buttonTypes[0]}">
      ${this.image ? html`<div><img src="${this.image}" alt="${this.content}" /></div>` : html`${this.content}`}
    </button>`;
  }
}

customElements.get('wc-button') || customElements.define('wc-button', Button);
