// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const DEFAULT_GEOLOCATION_TIMEOUT = 10000;

export const STATE_MODALITIES = {
  map: "map",
  list: "list",
};

export const LANGUAGES = {
  EN: "en",
  DE: "de",
  IT: "it",
};

/** Today's date as yyyy-MM-dd (default begindate so past events are hidden). */
export function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

/** Resolve begindate attribute: empty / "now" → today; otherwise the given yyyy-MM-dd. */
export function resolveBeginDate(value) {
  if (!value || value === "now") {
    return todayDateString();
  }
  return value;
}

export const getDefaultFilters = () => ({
  radius: "0",
  dateFrom: todayDateString(),
  dateTo: "",
  topic: [], // Array of numbers
});

export const STATE_DEFAULT_FILTERS = getDefaultFilters();

export const STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN = {};

export const isMobile = () => {
  return document.body.offsetWidth < 992;
};

export function getCurrentPosition(options = {}) {
  //                 milli * s * m   = 1h
  const maximumAge = 1000 * 60 * 60;
  return new Promise((resolve, reject) => {
    if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        maximumAge,
        timeout: DEFAULT_GEOLOCATION_TIMEOUT,
        ...options,
      });
    } else {
      alert("Not supported");
      reject(); // geolocalization probably not supported
    }
  });
}

export function get_system_language() {
  const locale = navigator.languages
    ? navigator.languages[0]
    : navigator.language;
  const lang = locale.substr(0, 2);
  return Object.values(LANGUAGES).includes(lang) ? lang : LANGUAGES.EN;
}

export function getLatLongFromStationDetail(o) {
  return { lat: o.y, lng: o.x };
}

export function countFilters(filters) {
  let filtersNumber = 0;
  if (filters.radius !== "0") {
    filtersNumber = filtersNumber + 1;
  }

  // Default is begindate=today with no enddate — don't count that as an active filter
  const isDefaultDateFilter =
    filters.dateFrom === todayDateString() &&
    !(filters.dateTo && filters.dateTo.length);
  if (
    !isDefaultDateFilter &&
    ((filters.dateFrom && filters.dateFrom.length) ||
      (filters.dateTo && filters.dateTo.length))
  ) {
    filtersNumber = filtersNumber + 1;
  }

  if (filters.topic.length) {
    filtersNumber = filtersNumber + 1;
  }

  return filtersNumber;
}

export const getTranslatedObject = (language, object) => {
  if (!object || typeof object !== "object") {
    return {};
  }
  if (object[language]) {
    return object[language];
  }

  // Reference https://github.com/noi-techpark/webcomp-events/issues/25#issuecomment-811103663

  // Fallbacks
  if (language === "en") {
    if (object["it"]) {
      return object["it"];
    } else if (object["de"]) {
      return object["de"];
    }
  }
  if (language === "de") {
    if (object["it"]) {
      return object["it"];
    } else if (object["en"]) {
      return object["en"];
    }
  }
  if (language === "it") {
    if (object["de"]) {
      return object["de"];
    } else if (object["en"]) {
      return object["en"];
    }
  }

  return {}; // to fix problem with reduced data from Open Data Hub
};
