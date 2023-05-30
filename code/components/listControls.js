// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { html } from "lit-html";
import mapImage from "../assets/map.svg";
import { STATE_MODALITIES } from "../utils";

export function render__listControls() {
  const chengeModalityToMap = () => {
    this.modality = STATE_MODALITIES.map;
  };

  return html`
    <div class="map_controls">
      <wc-button
        @click="${chengeModalityToMap}"
        type="square"
        .image="${mapImage}"
      ></wc-button>
    </div>
  `;
}

/* <div
        @click=${() => {
          this.handleFullScreenMap();
        }}
        class=${`map_controls__button ${
          isMobile() && !this.mobile_open ? "" : `d-none`
        }`}
      >
        <img src=${expandImage} alt="" />
      </div> */
