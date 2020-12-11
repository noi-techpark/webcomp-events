import { LitElement, html, css, unsafeCSS } from 'lit-element';
import style from './tag.scss';

import xBlackIcon from '../assets/x-black.svg';
import xWhiteIcon from '../assets/x-white.svg';
import xGreenIcon from '../assets/x-green.svg';

const tagTypes = ['primary', 'secondary', 'outline'];

const typesIconsCombinations = {
  primary: xWhiteIcon,
  secondary: xGreenIcon,
  outline: xBlackIcon
};

export class Tag extends LitElement {
  constructor() {
    super();
    this.type = tagTypes[0];
    this.icon = false;
    this.content = '---';
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      type: { type: String },
      icon: { type: Boolean },
      content: { type: String }
    };
  }

  render() {
    let classExist = tagTypes.includes(this.type);
    return html`<span class="${classExist ? this.type : tagTypes[0]}"
      >${this.content} ${this.icon ? html`<img src="${typesIconsCombinations[this.type]}" alt="" />` : ''}</span
    >`;
  }
}

customElements.get('wc-tag') || customElements.define('wc-tag', Tag);
