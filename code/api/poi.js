// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BASE_PATH_TOURISM_EVENT,
  BASE_PATH_TOURISM_ODHACTIVITYPOI,
  ORIGIN,
} from "./config";

/**
 * Place / event name search for the search bar.
 *
 * - Event `searchfilter`: full-text on Tourism Event (titles etc.).
 * - ODHActivityPoi `searchfilter`: replaces the deprecated `/v1/Poi` endpoint;
 *   searches activity/POI titles and is used for "other results" near the map.
 * - Optional HERE Places fallback when no Event hits and a key is configured.
 */
export async function requestGetCoordinatesFromSearch(query) {
  const r = 150 * 1000;
  try {
    if (query) {
      let formattedTourismEventsData = [];
      // Keep search aligned with map defaults: hide past events when a begin date is set
      const begin =
        this.filters && this.filters.dateFrom
          ? `&begindate=${encodeURIComponent(this.filters.dateFrom)}`
          : "";
      const end =
        this.filters && this.filters.dateTo
          ? `&enddate=${encodeURIComponent(this.filters.dateTo)}`
          : "";
      const source =
        this.source
          ? `&source=${encodeURIComponent(this.source)}`
          : "";
      const tourismEventsRequest = await fetch(
        `${BASE_PATH_TOURISM_EVENT}?` +
          ORIGIN +
          `&active=true&odhactive=true&fields=Detail,Latitude,Longitude&searchfilter=${encodeURIComponent(
            query
          )}&pagesize=20${begin}${end}${source}`
      );
      if (tourismEventsRequest.status !== 200) {
        throw new Error(tourismEventsRequest.statusText);
      }
      const tourismEventsResponse = await tourismEventsRequest.json();
      if (tourismEventsResponse.Items) {
        formattedTourismEventsData = tourismEventsResponse.Items.map((o) => {
          let title = "";
          if (o.Detail && o.Detail[this.language]) {
            title = o.Detail[this.language].Title;
          }
          return {
            position: [o.Latitude, o.Longitude],
            title:
              title ||
              (o.Detail && o.Detail.it && o.Detail.it.Title) ||
              (o.Detail && o.Detail.de && o.Detail.de.Title) ||
              "",
          };
        }).filter((o) => o.position[0] && o.position[1] && o.title);
      }

      let formattedHereData = [];
      if (
        !formattedTourismEventsData.length &&
        process.env.DOTENV &&
        process.env.DOTENV.HEREMAPS_API_KEY
      ) {
        const hereResponse = await fetch(
          `https://places.ls.hereapi.com/places/v1/browse?apiKey=${process.env.DOTENV.HEREMAPS_API_KEY}&in=46.31,11.26;r=${r}&q=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          }
        );
        const hereData = await hereResponse.json();
        formattedHereData = (hereData.results?.items || []).map((item) => {
          return {
            position: item.position,
            title: item.title,
          };
        });
      }

      let formattedActivityPoiData = [];
      const activityPoiResponse = await fetch(
        `${BASE_PATH_TOURISM_ODHACTIVITYPOI}?pagenumber=1&pagesize=20&searchfilter=${encodeURIComponent(
          query
        )}&fields=Detail,GpsInfo&` + ORIGIN,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      if (activityPoiResponse.status === 200) {
        const activityPoiData = await activityPoiResponse.json();
        formattedActivityPoiData = (activityPoiData.Items || [])
          .map((item) => {
            const gps = (item.GpsInfo || []).find(
              (g) => g.Latitude && g.Longitude
            );
            if (!gps) {
              return null;
            }
            const detail = item.Detail || {};
            const title =
              (detail[this.language] && detail[this.language].Title) ||
              (detail.de && detail.de.Title) ||
              (detail.it && detail.it.Title) ||
              (detail.en && detail.en.Title) ||
              "";
            return {
              position: [gps.Latitude, gps.Longitude],
              title,
            };
          })
          .filter((o) => o && o.title);
      }

      this.searchPlacesFound = {
        "Open Data Hub": [...formattedTourismEventsData],
        "Other results": [...formattedActivityPoiData, ...formattedHereData],
      };
    }
  } catch (error) {
    console.error(error);
    this.searchPlacesFound = {};
  }
}
