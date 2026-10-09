// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import "@babel/polyfill";
import maplibreStyle from "maplibre-gl/dist/maplibre-gl.css";
import { css, html, unsafeCSS } from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import { debounce as _debounce } from "lodash";
import { requestTourismEventsPaginated } from "./api/events";
import { BASEMAP_STYLE_URL } from "./api/config";
import { requestGetCoordinatesFromSearch } from "./api/poi";
import { BaseEvents } from "./baseClass";
import { render_details } from "./components/details";
import { render_filters } from "./components/filters";
import { render__list } from "./components/list";
import { render__listControls } from "./components/listControls";
import { render__mapControls } from "./components/mapControls";
import { render_searchPlaces } from "./components/searchPlaces";
import { getFilters } from "./mainClassMethods/filters";
import {
  drawUserOnMap,
  initializeMap,
  updateEventTiles,
} from "./mainClassMethods/map";
import { observedProperties } from "./observedProperties";
import "./shared_components/button/button";
import "./shared_components/checkBox/checkBox";
import "./shared_components/divider/divider";
import "./shared_components/dropdown/dropdown";
import "./shared_components/languagePicker/languagePicker";
// Shared components
import "./shared_components/searchBar/searchBar";
import "./shared_components/sideModalHeader/sideModalHeader";
import "./shared_components/sideModalRow/sideModalRow";
import "./shared_components/sideModalTabs/sideModalTabs";
import "./shared_components/tag/tag";
import { t } from "./translations";
import {
  getDefaultFilters,
  isMobile,
  LANGUAGES,
  resolveBeginDate,
  STATE_MODALITIES,
} from "./utils";
import EventsStyle from "./odh-events.scss";

class Events extends BaseEvents {
  static get properties() {
    return observedProperties;
  }

  static get styles() {
    return css`
      /* Map */
      ${unsafeCSS(maplibreStyle)}
      ${unsafeCSS(EventsStyle)}
    `;
  }

  handleWindowResize() {
    if (isMobile() !== this.isMobile) {
      if (!this.isMobile) {
        this.mobileOpen = true;
      }
      this.isMobile = isMobile();
    }
    if (this.map) {
      this.map.resize();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "resize",
      _debounce(this.handleWindowResize.bind(this), 150)
    );

    if (!this.tiles_url) {
      this.tiles_url = BASEMAP_STYLE_URL;
    }

    // Seed date filters from attributes (defaults: begindate=today, enddate=null)
    this.filters = {
      ...getDefaultFilters(),
      dateFrom: resolveBeginDate(this.begindate),
      dateTo: this.enddate && this.enddate.length ? this.enddate : "",
    };

    if (this.filterRadius && parseFloat(this.filterRadius)) {
      this.filters = {
        ...this.filters,
        radius: this.filterRadius,
      };
    }
    if (this.categoriesFilter && this.categoriesFilter.length) {
      this.filters = {
        ...this.filters,
        topic: this.categoriesFilter,
      };
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.handleWindowResize.bind(this));
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    super.disconnectedCallback();
  }

  async drawMap() {
    drawUserOnMap.bind(this)();
  }

  async firstUpdated() {
    await getFilters.bind(this)();

    if (this.modality === STATE_MODALITIES.list) {
      this.listEvents = await requestTourismEventsPaginated(
        this.filters,
        this.currentLocation,
        this.listEventsCurrentPage,
        this.pageSize,
        this.language,
        this.source
      );
    }

    if (this.modality === STATE_MODALITIES.map) {
      try {
        await initializeMap.bind(this)();
      } catch (err) {
        console.error("Failed to initialize events map", err);
      }
    }

    this.isLoading = false;
    if (this.map) {
      requestAnimationFrame(() => this.map && this.map.resize());
    }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "mobileOpen" || propName === "isMobile") {
        if (this.map) {
          requestAnimationFrame(() => this.map.resize());
        }
      }
      if (
        (propName === "filters" ||
          propName === "listEventsCurrentPage" ||
          propName === "language" ||
          propName === "modality" ||
          propName === "source") &&
        this.modality === STATE_MODALITIES.list
      ) {
        this.isLoading = true;
        requestTourismEventsPaginated(
          this.filters,
          this.currentLocation,
          this.listEventsCurrentPage,
          this.pageSize,
          this.language,
          this.source
        ).then((events) => {
          this.listEvents = events;
          this.isLoading = false;
        });
      }
      if (
        (propName === "filters" ||
          propName === "source" ||
          propName === "begindate" ||
          propName === "enddate") &&
        this.modality === STATE_MODALITIES.map &&
        this.map
      ) {
        if (propName === "begindate" || propName === "enddate") {
          this.filters = {
            ...this.filters,
            dateFrom: resolveBeginDate(this.begindate),
            dateTo:
              this.enddate && this.enddate.length ? this.enddate : "",
          };
        }
        updateEventTiles.bind(this)();
        drawUserOnMap.bind(this)();
      }
      if (propName === "modality" && this.modality === STATE_MODALITIES.list) {
        if (this.map) {
          this.map.remove();
          this.map = undefined;
        }
        if (this.userMarker) {
          this.userMarker.remove();
          this.userMarker = undefined;
        }
      }
      if (propName === "modality" && oldValue === STATE_MODALITIES.list) {
        this.isLoading = true;
        // Wait for the map container to be in the DOM
        this.updateComplete.then(() =>
          initializeMap
            .bind(this)()
            .catch((err) => {
              console.error("Failed to initialize events map", err);
            })
            .finally(() => {
              this.isLoading = false;
              if (this.map) {
                requestAnimationFrame(() => this.map && this.map.resize());
              }
            })
        );
      }
    });
  }

  handleSearchBarFilterAction = () => {
    this.detailsOpen = false;
    this.filtersOpen = !this.filtersOpen;
  };

  debounced__request__get_coordinates_from_search = _debounce(
    requestGetCoordinatesFromSearch.bind(this),
    500
  );

  render() {
    let isSmallWidth = false;
    let isSmallHeight = false;
    if (this.width.includes("px")) {
      isSmallWidth = parseInt(this.width.replace("px")) <= 400;
    } else if (this.width.includes("%")) {
      if (this.shadowRoot.querySelector(".events")) {
        isSmallWidth =
          this.shadowRoot.querySelector(".events").clientWidth <= 400;
      }
    }

    let height = `${this.height}`;

    if (this.height.includes("px")) {
      isSmallHeight = parseInt(this.height.replace("px")) <= 400;
    } else if (this.height.includes("%")) {
      if (this.shadowRoot.querySelector(".events")) {
        height = `${this.shadowRoot.querySelector(".events").clientHeight}px`;
        isSmallHeight =
          this.shadowRoot.querySelector(".events").clientHeight <= 400;
      }
    }

    return html`
      <style>
        :host {
          --width: ${this.width};
          --height: ${height};
          --w-c-font-family: ${this.fontFamily};
          display: block;
          width: ${this.width};
          height: ${height};
          box-sizing: border-box;
        }
      </style>

      <div
        class=${classMap({
          events: true,
          mobile: this.isMobile,
          MODE__mobile__open: this.isMobile && this.mobileOpen,
          MODE__mobile__closed: this.isMobile && !this.mobileOpen,
          isSmallWidth: isSmallWidth,
          isSmallHeight: isSmallHeight,
        })}
      >
        ${this.isLoading ? html`<div class="globalOverlay"></div>` : ""}
        ${(isMobile() &&
          !this.detailsOpen &&
          !this.filtersOpen &&
          this.mobileOpen) ||
        !isMobile()
          ? html`<div class="events__language_picker">
              <wc-languagepicker
                .supportedLanguages="${LANGUAGES}"
                .language="${this.language}"
                .changeLanguageAction="${(language) => {
                  this.language = language;
                }}"
              ></wc-languagepicker>
            </div>`
          : null}
        ${(this.isMobile && this.mobileOpen) || !this.isMobile
          ? html` <div class="events__sideBar">
              <div class="events__sideBar__searchBar">
                ${render_searchPlaces.bind(this)()}
              </div>

              ${this.detailsOpen
                ? html`<div class="events__sideBar__details mt-4px">
                    ${render_details.bind(this)()}
                  </div>`
                : ""}
              ${this.filtersOpen
                ? html`<div class="events__sideBar__filters mt-4px">
                    ${render_filters.bind(this)()}
                  </div>`
                : ""}
            </div>`
          : null}

        <!-- Map -->
        ${this.modality === STATE_MODALITIES.map
          ? html`<div id="${STATE_MODALITIES.map}"></div>
              ${(this.isMobile && this.mobileOpen) || !this.isMobile
                ? html`${render__mapControls.bind(this)()}`
                : null}`
          : null}
        <!-- List -->
        ${this.modality === STATE_MODALITIES.list
          ? html`<div id="${STATE_MODALITIES.list}">
              ${render__list.bind(this)()}
              ${(this.isMobile && this.mobileOpen) || !this.isMobile
                ? html`${render__listControls.bind(this)()}`
                : null}
            </div> `
          : null}
      </div>
    `;
  }
}

customElements.get("odh-events") ||
  customElements.define("odh-events", Events);
