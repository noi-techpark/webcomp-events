import {
  BASE_PATH_TOURISM_EVENT,
  BASE_PATH_TOURISM_EVENTTOPICS,
  // BASE_PATH_TOURISM_EVENTTYPES,
  BASE_PATH_TOURISM_EVENT_REDUCED,
} from "./config";

const createUrlFilters = (filters, currentLocation) => {
  let dateFromFilter = "";
  if (filters.dateFrom.length) {
    dateFromFilter = `&begindate=${filters.dateFrom}`;
  }

  let dateToFilter = "";
  if (filters.dateTo.length) {
    dateToFilter = `&enddate=${filters.dateTo}`;
  }

  let topicFilter = "";
  if (filters.topic.length) {
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

  return `${dateFromFilter}${dateToFilter}${topicFilter}${radius}`;
};

export const requestTourismEvents = async (filters, currentLocation) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_EVENT_REDUCED}?active=true&odhactive=true&fields=Id,Latitude,Longitude${createUrlFilters(
        filters,
        currentLocation
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

export const requestTourismEventsPaginated = async (
  filters,
  currentLocation,
  pageNumber,
  pageSize,
  language
) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_EVENT}?active=true&odhactive=true&fields=Id,Detail,CategoryCodes,LocationInfo&pagenumber=${pageNumber}&pagesize=${pageSize}${createUrlFilters(
        filters,
        currentLocation
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
    const request = await fetch(`${BASE_PATH_TOURISM_EVENTTOPICS}`);
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
    const request = await fetch(`${BASE_PATH_TOURISM_EVENT}/${Id}`);
    if (request.status !== 200) {
      throw new Error(request.statusText);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};
