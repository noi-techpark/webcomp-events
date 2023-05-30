// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// import { requestTourismEvents } from './events';
import {
  BASE_PATH_TOURISM_EVENT,
  ORIGIN
} from "./config";

export async function requestGetCoordinatesFromSearch(query) {
  const r = 150 * 1000;
  try {
    if (query) {
      // Stations related data

      let formattedTourismEventsData = [];
      const tourismEventsRequest = await fetch(
        `${BASE_PATH_TOURISM_EVENT}?` + ORIGIN + `&active=true&odhactive=true&fields=Detail,Latitude,Longitude&searchfilter=${query}`
      );
      if (tourismEventsRequest.status !== 200) {
        throw new Error(tourismEventsRequest.statusText);
      }
      const tourismEventsResponse = await tourismEventsRequest.json();
      if (tourismEventsResponse.Items) {
        formattedTourismEventsData = tourismEventsResponse.Items.map((o) => {
          let title = "";
          if (o.Detail[this.language]) {
            title = o.Detail[this.language].Title;
          }
          return {
            position: [o.Latitude, o.Longitude],
            title: title || o.Detail.it.Title || o.Detail.de.Title || "",
          };
        });
      }

      // Other data search

      let formattedHereData = [];
      if (
        !formattedTourismEventsData.length &&
        process.env.DOTENV.HEREMAPS_API_KEY
      ) {
        const hereResponse = await fetch(
          `https://places.ls.hereapi.com/places/v1/browse?apiKey=${process.env.DOTENV.HEREMAPS_API_KEY}&in=46.31,11.26;r=${r}&q=${query}`,
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          }
        );
        const hereData = await hereResponse.json();
        formattedHereData = hereData.results.items.map((item) => {
          return {
            position: item.position,
            title: item.title,
          };
        });
      }

      //

      const tourismResponse = await fetch(
        `https://tourism.opendatahub.bz.it/v1/Poi?pagenumber=1&pagesize=10000&poitype=511&searchfilter=${query}&origin=webcomp-events`,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
          }),
        }
      );
      const tourismData = await tourismResponse.json();
      const formattedTourismData = tourismData.Items.map((item) => {
        return {
          position: [item.GpsInfo[0].Latitude, item.GpsInfo[0].Longitude],
          title: item.Detail[this.language].Title,
        };
      });

      this.searchPlacesFound = {
        "Open Data Hub": [...formattedTourismEventsData],
        "Other results": [...formattedTourismData, ...formattedHereData],
      };
    }
  } catch (error) {
    console.error(error);
    this.searchPlacesFound = {};
  }
}
