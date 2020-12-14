export const observedProperties = {
  height: { type: String },
  width: { type: String },
  fontFamily: { type: String },
  language: { type: String },
  tiles_url: { type: String, attribute: "tiles-url" },
  modality: { type: String },

  isLoading: { type: Boolean },

  hereMapsQuery: { type: String },
  hereMapsPlacesFound: { type: Array },
  mapAttribution: { type: String },

  listEvents: { type: Array },
  listEventsCurrentPage: { type: Number },
  currentEvent: { type: Object },

  listEventsTopics: { type: Array },

  detailsOpen: { type: Boolean },
  filtersOpen: { type: Boolean },

  // Filters
  filters: { type: Object },

  filtersAccordionOpen: { type: Object },
};
