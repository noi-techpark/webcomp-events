import {
  BASE_PATH_TOURISM_EVENT,
  BASE_PATH_TOURISM_EVENTTOPICS,
  BASE_PATH_TOURISM_EVENTTYPES,
  BASE_PATH_TOURISM_EVENT_REDUCED,
} from "./config";

const createUrlFilters = (filters, currentLocation) => {
  let categorycodefilter = "";
  if (filters.categories.length) {
    categorycodefilter = `&categorycodefilter=${filters.categories.toString()}`;
  }
  let facilityCodesCreditCard = "";
  if (filters.facilityCodesCreditCard.length) {
    facilityCodesCreditCard = `&facilitycodefilter=${filters.facilityCodesCreditCard.toString()}`;
  }
  let facilityCodesFeatures = "";
  if (filters.facilityCodesFeatures.length) {
    facilityCodesFeatures = `&facilitycodefilter=${filters.facilityCodesFeatures.toString()}`;
  }
  let facilityCodesQuality = "";
  if (filters.facilityCodesQuality.length) {
    facilityCodesQuality = `&facilitycodefilter=${filters.facilityCodesQuality.toString()}`;
  }
  let facilityCodesCuisine = "";
  if (filters.facilityCodesCuisine.length) {
    facilityCodesCuisine = `&facilitycodefilter=${filters.facilityCodesCuisine.toString()}`;
  }
  let radius = "";
  if (filters.radius && filters.radius !== "0") {
    radius = `&latitude=${currentLocation.lat}&longitude=${
      currentLocation.lng
    }&radius=${parseInt(filters.radius) * 1000}`;
  }
  return `${categorycodefilter}${facilityCodesCreditCard}${facilityCodesFeatures}${facilityCodesQuality}${facilityCodesCuisine}${radius}`;
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
  language
) => {
  try {
    const request = await fetch(
      `${BASE_PATH_TOURISM_EVENT}?active=true&odhactive=true&language=${language}&fields=Id,Detail,CategoryCodes,LocationInfo&pagenumber=${pageNumber}&pagesize=10${createUrlFilters(
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
