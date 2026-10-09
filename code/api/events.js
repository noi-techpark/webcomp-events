// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BASE_PATH_TOURISM_EVENT,
  BASE_PATH_TOURISM_EVENTTOPICS,
  GEO_BASE_URL,
  ORIGIN,
} from "./config";

const createUrlFilters = (filters, currentLocation, source) => {
  let dateFromFilter = "";
  if (filters.dateFrom && filters.dateFrom.length) {
    dateFromFilter = `&begindate=${filters.dateFrom}`;
  }

  let dateToFilter = "";
  if (filters.dateTo && filters.dateTo.length) {
    dateToFilter = `&enddate=${filters.dateTo}`;
  }

  let topicFilter = "";
  if (filters.topic && filters.topic.length) {
    const bitmaskSum = filters.topic.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    topicFilter = `&topicfilter=${bitmaskSum}`;
  }

  let radius = "";
  if (filters.radius && filters.radius !== "0") {
    radius = `&latitude=${currentLocation.lat}&longitude=${
      currentLocation.lng
    }&radius=${parseInt(filters.radius) * 1000}`;
  }

  let sourceFilter = "";
  if (source) {
    sourceFilter = `&source=${encodeURIComponent(source)}`;
  }

  return `${dateFromFilter}${dateToFilter}${topicFilter}${radius}${sourceFilter}`;
};

/**
 * Vector tile URL template of the Geo Api. Clustering is done server side.
 * REST Event list calls are too slow for the map; tiles replace them.
 */
export function eventTilesUrl({ source, begindate, enddate } = {}) {
  const params = new URLSearchParams({
    operationmode: "points",
    enableclustering: "true",
  });
  if (source) {
    params.set("source", source);
  }
  if (begindate) {
    params.set("begindate", begindate);
  }
  if (enddate) {
    params.set("enddate", enddate);
  }
  return `${GEO_BASE_URL}/api/tiles/event/{z}/{x}/{y}.pbf?${params}`;
}

/** The Geo Api may suffix open-data copies with "_REDUCED"; Content Api expects the plain Id. */
export function toContentApiId(tileFeatureId) {
  return String(tileFeatureId).replace(/_REDUCED$/i, "");
}

export const requestTourismEventsPaginated = async (
  filters,
  currentLocation,
  pageNumber,
  pageSize,
  language,
  source
) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_EVENT}?active=true&odhactive=true&` +
        ORIGIN +
        `&fields=Id,Detail,CategoryCodes,LocationInfo,DateBegin,DateEnd&pagenumber=${pageNumber}&pagesize=${pageSize}${createUrlFilters(
          filters,
          currentLocation,
          source
        )}`
    );
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const requestTourismEventsCodes = async () => {
  try {
    const request = await fetch(`${BASE_PATH_TOURISM_EVENTTOPICS}?` + ORIGIN);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const requestTourismEventDetails = async ({ Id }) => {
  try {
    const id = toContentApiId(Id);
    const request = await fetch(
      `${BASE_PATH_TOURISM_EVENT}/${encodeURIComponent(id)}?` + ORIGIN
    );
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};
