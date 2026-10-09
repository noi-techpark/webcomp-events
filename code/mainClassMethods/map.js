// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import maplibregl from "maplibre-gl";
import {
  eventTilesUrl,
  requestTourismEventDetails,
  toContentApiId,
} from "../api/events";
import { BASEMAP_STYLE_URL } from "../api/config";
import user__marker from "../assets/user.svg";

const SOURCE_ID = "events";
const SOURCE_LAYER = "event";
const LAYER_CLUSTERS = "event-clusters";
const LAYER_POINTS = "event-points";
const USER_SOURCE_ID = "user-location";
const USER_LAYER_ID = "user-location-circle";

function createGeoJSONCircle([lng, lat], radiusInKm, points = 64) {
  if (!radiusInKm || radiusInKm <= 0) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }
  const coords = [];
  const distanceX =
    radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    coords.push([
      lng + distanceX * Math.cos(theta),
      lat + distanceY * Math.sin(theta),
    ]);
  }
  coords.push(coords[0]);
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [coords] },
      },
    ],
  };
}

export function getEventTileParams() {
  return {
    source: this.source || undefined,
    begindate: this.filters.dateFrom || undefined,
    enddate: this.filters.dateTo || undefined,
  };
}

export function updateEventTiles() {
  if (!this.map || !this.map.getSource(SOURCE_ID)) {
    return;
  }
  this.map
    .getSource(SOURCE_ID)
    .setTiles([eventTilesUrl(getEventTileParams.bind(this)())]);
}

export async function initializeMap() {
  if (this.map) {
    this.map.remove();
    this.map = undefined;
  }
  if (this.userMarker) {
    this.userMarker.remove();
    this.userMarker = undefined;
  }

  const container = this.shadowRoot.getElementById("map");
  if (!container) {
    return;
  }

  const styleUrl = this.tiles_url || BASEMAP_STYLE_URL;
  const lng = parseFloat(this.currentLocation?.lng);
  const lat = parseFloat(this.currentLocation?.lat);

  this.map = new maplibregl.Map({
    container,
    style: styleUrl,
    center: [
      Number.isFinite(lng) ? lng : 11.35,
      Number.isFinite(lat) ? lat : 46.5,
    ],
    zoom: 10,
    attributionControl: {
      compact: true,
      customAttribution:
        this.mapAttribution ||
        '<a target="_blank" rel="noopener" href="https://opendatahub.com">Open Data Hub</a>',
    },
  });

  this.hoveredId = null;
  this.selectedId = null;
  this.detailRequest = this.detailRequest || 0;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("MapLibre load timed out"));
    }, 20000);

    const onLoad = () => {
      cleanup();
      try {
        addEventLayers.bind(this)();
        bindMapEvents.bind(this)();
        drawUserOnMap.bind(this)();
        // Layout may still be settling (loading overlay / % heights)
        requestAnimationFrame(() => this.map && this.map.resize());
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    const cleanup = () => {
      clearTimeout(timeout);
      this.map.off("load", onLoad);
    };

    this.map.on("load", onLoad);
  });
}

function addEventLayers() {
  const primary = "#4285f4";
  const primaryStrong = "#1a73e8";
  const accent = "#ea4335";
  const surface = "#ffffff";
  const count = ["to-number", ["get", "count"], 2];
  const clusterRadius = (extra) => [
    "interpolate",
    ["linear"],
    ["zoom"],
    8,
    [
      "interpolate",
      ["linear"],
      count,
      2,
      8 + extra,
      50,
      12 + extra,
      1000,
      18 + extra,
    ],
    13,
    [
      "interpolate",
      ["linear"],
      count,
      2,
      11 + extra,
      50,
      16 + extra,
      1000,
      24 + extra,
    ],
  ];
  const isActive = [
    "any",
    ["boolean", ["feature-state", "hover"], false],
    ["boolean", ["feature-state", "selected"], false],
  ];

  this.map.addSource(SOURCE_ID, {
    type: "vector",
    tiles: [eventTilesUrl(getEventTileParams.bind(this)())],
    minzoom: 0,
    maxzoom: 22,
    promoteId: "id",
  });

  this.map.addLayer({
    id: `${LAYER_CLUSTERS}-halo`,
    type: "circle",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["==", ["get", "cluster"], true],
    layout: { "circle-sort-key": count },
    paint: {
      "circle-color": primary,
      "circle-opacity": 0.18,
      "circle-radius": clusterRadius(5),
    },
  });

  this.map.addLayer({
    id: LAYER_CLUSTERS,
    type: "circle",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["==", ["get", "cluster"], true],
    layout: { "circle-sort-key": count },
    paint: {
      "circle-color": [
        "interpolate",
        ["linear"],
        count,
        2,
        primary,
        500,
        primaryStrong,
      ],
      "circle-radius": clusterRadius(0),
      "circle-stroke-width": 2,
      "circle-stroke-color": surface,
    },
  });

  this.map.addLayer({
    id: `${LAYER_CLUSTERS}-count`,
    type: "symbol",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["==", ["get", "cluster"], true],
    layout: {
      "text-field": ["to-string", count],
      "text-font": ["Noto Sans Bold"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 8, 10, 13, 12],
      "symbol-sort-key": count,
      "text-allow-overlap": true,
    },
    paint: { "text-color": surface },
  });

  this.map.addLayer({
    id: LAYER_POINTS,
    type: "circle",
    source: SOURCE_ID,
    "source-layer": SOURCE_LAYER,
    filter: ["!=", ["get", "cluster"], true],
    paint: {
      "circle-color": ["case", isActive, accent, primary],
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["case", isActive, 8, 5],
        14,
        ["case", isActive, 11, 7],
        18,
        ["case", isActive, 14, 10],
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": surface,
    },
  });
}

function setFeatureState(id, state) {
  if (id != null && this.map) {
    this.map.setFeatureState(
      { source: SOURCE_ID, sourceLayer: SOURCE_LAYER, id },
      state
    );
  }
}

function bindMapEvents() {
  [LAYER_CLUSTERS, LAYER_POINTS].forEach((layer) => {
    this.map.on("mouseenter", layer, () => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", layer, () => {
      this.map.getCanvas().style.cursor = "";
    });
  });

  this.map.on("mousemove", LAYER_POINTS, (e) => {
    const id = e.features[0]?.id;
    if (id === this.hoveredId) {
      return;
    }
    setFeatureState.bind(this)(this.hoveredId, { hover: false });
    this.hoveredId = id;
    setFeatureState.bind(this)(id, { hover: true });
  });
  this.map.on("mouseleave", LAYER_POINTS, () => {
    setFeatureState.bind(this)(this.hoveredId, { hover: false });
    this.hoveredId = null;
  });

  this.map.on("click", LAYER_CLUSTERS, (e) => {
    this.map.easeTo({
      center: e.features[0].geometry.coordinates,
      zoom: Math.min(this.map.getZoom() + 2, 17),
    });
  });

  this.map.on("click", async (e) => {
    const feature = this.map.queryRenderedFeatures(e.point, {
      layers: [LAYER_POINTS],
    })[0];
    if (feature) {
      await openEventDetail.bind(this)(feature);
    } else if (
      !this.map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTERS] })
        .length
    ) {
      closeEventDetail.bind(this)();
    }
  });
}

// closeEventDetail is used from details panel close as well

async function openEventDetail(feature) {
  // promoteId maps properties.id → feature.id; fall back for safety
  const featureId = feature.id ?? feature.properties?.id;
  if (featureId == null) {
    return;
  }
  setFeatureState.bind(this)(this.selectedId, { selected: false });
  this.selectedId = featureId;
  setFeatureState.bind(this)(this.selectedId, { selected: true });

  const requestId = ++this.detailRequest;
  const details = await requestTourismEventDetails({
    Id: toContentApiId(featureId),
  });
  if (requestId !== this.detailRequest) {
    return;
  }
  if (details) {
    this.currentEvent = { ...details };
    this.filtersOpen = false;
    this.detailsOpen = true;
  }
}

export function closeEventDetail() {
  this.detailRequest = (this.detailRequest || 0) + 1;
  setFeatureState.bind(this)(this.selectedId, { selected: false });
  this.selectedId = null;
  this.detailsOpen = false;
  this.currentEvent = {};
}

export function drawUserOnMap() {
  if (!this.map) {
    return;
  }

  const lngLat = [this.currentLocation.lng, this.currentLocation.lat];
  const radiusKm = parseFloat(this.filters.radius) || 0;

  if (this.userMarker) {
    this.userMarker.setLngLat(lngLat);
  } else {
    const el = document.createElement("div");
    el.style.width = "25px";
    el.style.height = "25px";
    el.style.backgroundImage = `url(${user__marker})`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    this.userMarker = new maplibregl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(this.map);
  }

  const circleData = createGeoJSONCircle(lngLat, radiusKm);
  if (this.map.getSource(USER_SOURCE_ID)) {
    this.map.getSource(USER_SOURCE_ID).setData(circleData);
  } else {
    this.map.addSource(USER_SOURCE_ID, {
      type: "geojson",
      data: circleData,
    });
    this.map.addLayer({
      id: USER_LAYER_ID,
      type: "fill",
      source: USER_SOURCE_ID,
      paint: {
        "fill-color": "rgba(66, 133, 244, 0.5)",
        "fill-outline-color": "rgba(66, 133, 244, 0.6)",
      },
    });
  }
}

/** @deprecated Map markers come from vector tiles; kept as no-op for call sites. */
export async function drawEventsOnMap() {
  updateEventTiles.bind(this)();
}
