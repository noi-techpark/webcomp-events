// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement } from "lit-element";
import { BASEMAP_STYLE_URL } from "./api/config";
import {
  get_system_language,
  getDefaultFilters,
  isMobile,
  STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN,
  STATE_MODALITIES,
} from "./utils";

export class BaseEvents extends LitElement {
  constructor() {
    super();
    this.height = "500px";
    this.width = "100%";
    this.fontFamily = "";
    this.mapAttribution = "";
    this.language = get_system_language();
    this.modality = STATE_MODALITIES.map;
    this.pageSize = 10;
    this.disableEventDirections = false;
    this.categoriesFilter = [];
    this.source = "";
    this.begindate = "";
    this.enddate = "";
    this.tiles_url = BASEMAP_STYLE_URL;

    this.isLoading = true;
    this.mobileOpen = true;
    this.isMobile = isMobile();

    this.map = undefined;
    this.currentLocation = { lat: 46.479, lng: 11.331 };

    this.searchPlacesFound = {};
    this.hereMapsQuery = "";

    this.currentEvent = {};

    this.listEvents = [];
    this.listEventsCurrentPage = 1;

    this.detailsOpen = false;
    this.filtersOpen = false;
    this.detailRequest = 0;

    this.filters = getDefaultFilters();
    this.filtersAccordionOpen = STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN;

    this.listEventsTopics = [];
  }
}
