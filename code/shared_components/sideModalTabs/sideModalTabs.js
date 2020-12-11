import { css, html, LitElement, unsafeCSS } from 'lit-element';
import style from './sideModalTabs.scss';

export class SideModalTabs extends LitElement {
  constructor() {
    super();

    this.elements = [];
    this.idSelected = 1;
    this.action = (id) => {
      console.log(id);
    };
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      elements: { type: Array },
      idSelected: { type: Number }
    };
  }

  handleTabClick = (id) => {
    this.idSelected = id;
    this.action(id);
  };

  render() {
    return html`<div class="sideModalTabs">
      ${this.elements.map((o) => {
        return html`<div class="sideModalTabs__tab ${o.id === this.idSelected ? 'active' : ''}">
          <p
            @click="${() => {
              this.handleTabClick(o.id);
            }}"
          >
            ${o.label}
          </p>
          <div class="sideModalTabs__tab__underline"></div>
        </div>`;
      })}
    </div>`;
  }
}

customElements.get('wc-sidemodal-tabs') || customElements.define('wc-sidemodal-tabs', SideModalTabs);
