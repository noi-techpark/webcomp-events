import "@babel/polyfill";
import leafletStyle from "leaflet/dist/leaflet.css";
import { css, html, unsafeCSS } from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import { debounce as _debounce } from "lodash";
import { requestTourismEventsPaginated } from "./api/events";
import { requestGetCoordinatesFromSearch } from "./api/hereMaps";
import { BaseEvents } from "./baseClass";
import { render_details } from "./components/details";
import { render_filters } from "./components/filters";
import { render__list } from "./components/list";
import { render__listControls } from "./components/listControls";
import { render__mapControls } from "./components/mapControls";
import { render_searchPlaces } from "./components/searchPlaces";
import { getFilters } from "./mainClassMethods/filters";
import {
  drawEventsOnMap,
  drawUserOnMap,
  initializeMap,
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
import { isMobile, LANGUAGES, STATE_MODALITIES } from "./utils";
import EventsStyle from "./webcomp-events.scss";

class Events extends BaseEvents {
  static get properties() {
    return observedProperties;
  }

  static get styles() {
    return css`
      /* Map */
      ${unsafeCSS(leafletStyle)}
      ${unsafeCSS(EventsStyle)}
    `;
  }

  handleWindowResize() {
    if (isMobile() !== this.isMobile) {
      if (!this.isMobile) {
        this.mobileOpen = false;
      }
      this.isMobile = isMobile();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "resize",
      _debounce(this.handleWindowResize.bind(this), 150)
    );
    console.log(this.filterRadius);
    if (this.filterRadius && parseFloat(this.filterRadius)) {
      this.filters = {
        ...this.filters,
        radius: this.filterRadius,
      };
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.handleWindowResize.bind(this));
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
        this.language
      );
    }

    if (this.modality === STATE_MODALITIES.map) {
      initializeMap.bind(this)();
      drawUserOnMap.bind(this)();
      await drawEventsOnMap.bind(this)();
    }

    this.isLoading = false;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "mobileOpen" || propName === "isMobile") {
        if (this.map) {
          this.map.invalidateSize();
        }
      }
      if (
        (propName === "filters" ||
          propName === "listEventsCurrentPage" ||
          propName === "language" ||
          propName === "modality") &&
        this.modality === STATE_MODALITIES.list
      ) {
        this.isLoading = true;
        requestTourismEventsPaginated(
          this.filters,
          this.currentLocation,
          this.listEventsCurrentPage,
          this.pageSize,
          this.language
        ).then((events) => {
          this.listEvents = events;
          this.isLoading = false;
        });
      }
      if (
        (propName === "filters" || propName === "language") &&
        this.modality === STATE_MODALITIES.map
      ) {
        if (this.map) {
          this.map.off();
          this.map.remove();
          this.isLoading = true;
          initializeMap
            .bind(this)()
            .then(() => {
              drawUserOnMap.bind(this)();
              drawEventsOnMap
                .bind(this)()
                .then(() => {
                  this.isLoading = false;
                });
            });
        }
      }
      if (propName === "modality" && oldValue === STATE_MODALITIES.list) {
        this.isLoading = true;
        initializeMap.bind(this)();
        drawUserOnMap.bind(this)();
        drawEventsOnMap
          .bind(this)()
          .then(() => {
            this.isLoading = false;
          });
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
    if (!this.tiles_url) {
      return html`
        <p style="color:red">Required attribute \`tiles_url\` is missing</p>
      `;
    }

    let isSmallWidth = false;
    let isSmallHeight = false;
    if (this.width.includes("px")) {
      isSmallWidth = parseInt(this.width.replace("px")) <= 400;
    } else if (this.width.includes("%")) {
      if (this.shadowRoot.querySelector(".meteo_generic")) {
        isSmallWidth =
          this.shadowRoot.querySelector(".meteo_generic").clientWidth <= 400;
      }
    }
    if (this.height.includes("px")) {
      isSmallHeight = parseInt(this.height.replace("px")) <= 400;
    } else if (this.height.includes("%")) {
      if (this.shadowRoot.querySelector(".meteo_generic")) {
        isSmallHeight =
          this.shadowRoot.querySelector(".meteo_generic").clientHeight <= 400;
      }
    }

    return html`
      <style>
        * {
          --width: ${this.width};
          --height: ${this.height};
          --w-c-font-family: ${this.fontFamily};
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
        ${this.isMobile && !this.mobileOpen
          ? html`<div class="MODE__mobile__closed__overlay">
              <wc-button
                @click="${() => {
                  this.mobileOpen = true;
                }}"
                type="primary"
                .content="${this.modality === STATE_MODALITIES.map
                  ? t["openTheMap"][this.language]
                  : t["openTheList"][this.language]}"
              ></wc-button>
            </div>`
          : ""}
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

customElements.get("webcomp-events") ||
  customElements.define("webcomp-events", Events);
