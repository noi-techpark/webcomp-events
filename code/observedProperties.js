export const observedProperties = {
  height: { type: String },
  width: { type: String },
  fontFamily: { type: String },
  language: { type: String },
  tiles_url: { type: String, attribute: "tiles-url" },
  modality: { type: String },
  disableEventDirections: { type: Boolean },
  categoriesFilter: { type: Array },

  isLoading: { type: Boolean },
  mobileOpen: { type: Boolean },
  isMobile: { type: Boolean },

  hereMapsQuery: { type: String },
  searchPlacesFound: { type: Array },
  mapAttribution: { type: String },

  pageSize: { type: Number },
  listEvents: { type: Array },
  listEventsCurrentPage: { type: Number },
  currentEvent: { type: Object },

  listEventsTopics: { type: Array },

  detailsOpen: { type: Boolean },
  filtersOpen: { type: Boolean },

  // Filters
  filters: { type: Object },
  filterRadius: { type: String },

  filtersAccordionOpen: { type: Object },
};
