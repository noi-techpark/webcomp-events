// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const BASE_PATH_TOURISM =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.DOTENV &&
    process.env.DOTENV.TOURISM_BASE_PATH) ||
  "https://tourism.api.opendatahub.com/v1";

export const GEO_BASE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.DOTENV &&
    process.env.DOTENV.GEO_BASE_PATH) ||
  "https://geo.api.opendatahub.com";

export const BASEMAP_STYLE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.DOTENV &&
    process.env.DOTENV.BASEMAP_STYLE_URL) ||
  "https://tiles.openfreemap.org/styles/positron";

export const BASE_PATH_TOURISM_EVENT = `${BASE_PATH_TOURISM}/Event`;
export const BASE_PATH_TOURISM_EVENT_REDUCED = `${BASE_PATH_TOURISM}/EventReduced`;
export const BASE_PATH_TOURISM_EVENTTOPICS = `${BASE_PATH_TOURISM}/EventTopics`;
export const BASE_PATH_TOURISM_ODHACTIVITYPOI = `${BASE_PATH_TOURISM}/ODHActivityPoi`;
export const ORIGIN = "origin=webcomp-events";
