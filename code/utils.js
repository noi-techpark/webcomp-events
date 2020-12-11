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

export const STATE_DEFAULT_FILTERS = {
  radius: "0",
  categories: [],
  facilityCodesCreditCard: [],
  facilityCodesFeatures: [],
  facilityCodesQuality: [],
  facilityCodesCuisine: [],
  facilityCodesCeremony: [],
};

export const STATE_DEFAULT_FILTERS_ACCORDIONS_OPEN = {
  category: false,
  facilityCodesCreditCard: false,
  facilityCodesFeatures: false,
  facilityCodesQuality: false,
  facilityCodesCuisine: false,
  facilityCodesCeremony: false,
};

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

export function debounce(delay, fn) {
  let timerId;
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(async () => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function getLatLongFromStationDetail(o) {
  return { lat: o.y, lng: o.x };
}

export function countFilters(filters) {
  let filtersNumber = 0;
  if (filters.categories.length) {
    filtersNumber = filtersNumber + 1;
  }
  if (filters.facilityCodesCreditCard.length) {
    filtersNumber = filtersNumber + 1;
  }
  if (filters.facilityCodesFeatures.length) {
    filtersNumber = filtersNumber + 1;
  }
  if (filters.facilityCodesQuality.length) {
    filtersNumber = filtersNumber + 1;
  }
  if (filters.facilityCodesCuisine.length) {
    filtersNumber = filtersNumber + 1;
  }
  if (filters.facilityCodesCeremony.length) {
    filtersNumber = filtersNumber + 1;
  }

  return filtersNumber;
}
