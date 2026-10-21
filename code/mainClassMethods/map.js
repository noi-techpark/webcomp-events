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
const SPIDER_SOURCE_ID = "event-spider";
const LAYER_SPIDER_LEGS = "event-spider-legs";
const LAYER_SPIDER_POINTS = "event-spider-points";
// From this zoom a cluster carrying its members (Geo Api sends them for up to 10 points)
// is fanned out on hover/click instead of zooming in; points at the same location never separate
const SPIDERFY_FROM_ZOOM = 14;
// Pixel spacing between spider points and the pointer margin before the spider collapses
const SPIDER_POINT_SPACING = 26;
const SPIDER_MIN_RADIUS = 34;
const SPIDER_COLLAPSE_MARGIN = 30;
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
  const tags = this.filters.tags || [];
  return {
    source: this.source || undefined,
    begindate: this.filters.dateFrom || undefined,
    enddate: this.filters.dateTo || undefined,
    // Geo Api: comma-separated Tag.Id list (OR)
    tagfilter: tags.length ? tags.join(",") : undefined,
  };
}

export function updateEventTiles() {
  if (!this.map || !this.map.getSource(SOURCE_ID)) {
    return;
  }
  collapseSpider.bind(this)();
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
    // Custom position: bottom-left so attribution stays clear of map_controls
    attributionControl: false,
  });

  this.map.addControl(
    new maplibregl.AttributionControl({
      compact: true,
      customAttribution:
        this.mapAttribution ||
        '<a target="_blank" rel="noopener" href="https://opendatahub.com">Open Data Hub</a>',
    }),
    "bottom-left"
  );

  this.hoveredId = null;
  this.selectedId = null;
  this.spider = null;
  this.spiderHoveredId = null;
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
  const isSpiderfied = ["boolean", ["feature-state", "spiderfied"], false];
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
      "circle-opacity": ["case", isSpiderfied, 0, 0.18],
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
      "circle-opacity": ["case", isSpiderfied, 0.35, 1],
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
    paint: {
      "text-color": surface,
      "text-opacity": ["case", isSpiderfied, 0, 1],
    },
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

  this.map.addSource(SPIDER_SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
    promoteId: "id",
  });

  this.map.addLayer({
    id: LAYER_SPIDER_LEGS,
    type: "line",
    source: SPIDER_SOURCE_ID,
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": primaryStrong,
      "line-width": 1.5,
      "line-opacity": 0.6,
    },
  });

  this.map.addLayer({
    id: LAYER_SPIDER_POINTS,
    type: "circle",
    source: SPIDER_SOURCE_ID,
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-color": ["case", isActive, accent, primary],
      "circle-radius": ["case", isActive, 10, 7],
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

function setSpiderFeatureState(id, state) {
  if (id != null && this.map && this.map.getSource(SPIDER_SOURCE_ID)) {
    this.map.setFeatureState({ source: SPIDER_SOURCE_ID, id }, state);
  }
}

function parseClusterMembers(feature) {
  try {
    const members = JSON.parse(feature.properties?.members || "null");
    return Array.isArray(members) && members.length ? members : null;
  } catch (err) {
    return null;
  }
}

function canSpiderfy(feature) {
  return (
    this.map.getZoom() >= SPIDERFY_FROM_ZOOM && !!parseClusterMembers(feature)
  );
}

// Fans the cluster members out in a circle around the cluster, offsets in screen pixels
function spiderfyCluster(feature) {
  const clusterId = feature.id ?? feature.properties?.id;
  if (this.spider && this.spider.clusterId === clusterId) {
    return;
  }
  collapseSpider.bind(this)();

  const members = parseClusterMembers(feature);
  if (!members) {
    return;
  }
  const center = feature.geometry.coordinates;
  const centerPx = this.map.project(center);
  const radius = Math.max(
    SPIDER_MIN_RADIUS,
    (members.length * SPIDER_POINT_SPACING) / (2 * Math.PI)
  );

  const features = [];
  members.forEach((member, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / members.length;
    const lngLat = this.map.unproject([
      centerPx.x + radius * Math.cos(angle),
      centerPx.y + radius * Math.sin(angle),
    ]);
    const position = [lngLat.lng, lngLat.lat];
    const title = typeof member.data === "string" ? member.data : "";
    features.push({
      type: "Feature",
      properties: { id: `leg-${member.id}` },
      geometry: { type: "LineString", coordinates: [center, position] },
    });
    features.push({
      type: "Feature",
      properties: { id: member.id, title },
      geometry: { type: "Point", coordinates: position },
    });
  });

  this.map
    .getSource(SPIDER_SOURCE_ID)
    .setData({ type: "FeatureCollection", features });
  setFeatureState.bind(this)(clusterId, { spiderfied: true });
  if (members.some((member) => member.id === this.selectedId)) {
    setSpiderFeatureState.bind(this)(this.selectedId, { selected: true });
  }
  this.spider = { clusterId, center, radius };
}

function collapseSpider() {
  if (!this.spider || !this.map) {
    return;
  }
  setFeatureState.bind(this)(this.spider.clusterId, { spiderfied: false });
  this.spider = null;
  this.spiderHoveredId = null;
  if (this.spiderTooltip) {
    this.spiderTooltip.remove();
  }
  const source = this.map.getSource(SPIDER_SOURCE_ID);
  if (source) {
    this.map.removeFeatureState({ source: SPIDER_SOURCE_ID });
    source.setData({ type: "FeatureCollection", features: [] });
  }
}

function showSpiderTooltip(feature) {
  const title = feature.properties?.title;
  if (!title) {
    return;
  }
  if (!this.spiderTooltip) {
    this.spiderTooltip = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
    });
  }
  this.spiderTooltip
    .setLngLat(feature.geometry.coordinates)
    .setText(title)
    .addTo(this.map);
}

function bindMapEvents() {
  [LAYER_CLUSTERS, LAYER_POINTS, LAYER_SPIDER_POINTS].forEach((layer) => {
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

  // Desktop: hovering a small cluster fans it out
  this.map.on("mouseenter", LAYER_CLUSTERS, (e) => {
    const feature = e.features[0];
    if (feature && canSpiderfy.bind(this)(feature)) {
      spiderfyCluster.bind(this)(feature);
    }
  });

  // Collapse once the pointer leaves the spider area
  this.map.on("mousemove", (e) => {
    if (!this.spider) {
      return;
    }
    const centerPx = this.map.project(this.spider.center);
    const distance = Math.hypot(e.point.x - centerPx.x, e.point.y - centerPx.y);
    if (distance > this.spider.radius + SPIDER_COLLAPSE_MARGIN) {
      collapseSpider.bind(this)();
    }
  });

  this.map.on("mousemove", LAYER_SPIDER_POINTS, (e) => {
    const feature = e.features[0];
    const id = feature?.id;
    if (id === this.spiderHoveredId) {
      return;
    }
    setSpiderFeatureState.bind(this)(this.spiderHoveredId, { hover: false });
    this.spiderHoveredId = id;
    setSpiderFeatureState.bind(this)(id, { hover: true });
    showSpiderTooltip.bind(this)(feature);
  });
  this.map.on("mouseleave", LAYER_SPIDER_POINTS, () => {
    setSpiderFeatureState.bind(this)(this.spiderHoveredId, { hover: false });
    this.spiderHoveredId = null;
    if (this.spiderTooltip) {
      this.spiderTooltip.remove();
    }
  });

  // Pixel offsets do not scale with the zoom
  this.map.on("zoomstart", () => collapseSpider.bind(this)());

  this.map.on("click", LAYER_CLUSTERS, (e) => {
    if (
      this.map.queryRenderedFeatures(e.point, { layers: [LAYER_SPIDER_POINTS] })
        .length
    ) {
      return;
    }
    // Touch has no hover: a tap fans the cluster out
    if (canSpiderfy.bind(this)(e.features[0])) {
      spiderfyCluster.bind(this)(e.features[0]);
      return;
    }
    this.map.easeTo({
      center: e.features[0].geometry.coordinates,
      zoom: Math.min(this.map.getZoom() + 2, 17),
    });
  });

  this.map.on("click", async (e) => {
    const spiderFeature = this.map.queryRenderedFeatures(e.point, {
      layers: [LAYER_SPIDER_POINTS],
    })[0];
    if (spiderFeature) {
      await openEventDetail.bind(this)(spiderFeature);
      return;
    }
    const onCluster = this.map.queryRenderedFeatures(e.point, {
      layers: [LAYER_CLUSTERS],
    }).length;
    if (!onCluster) {
      collapseSpider.bind(this)();
    }
    const feature = this.map.queryRenderedFeatures(e.point, {
      layers: [LAYER_POINTS],
    })[0];
    if (feature) {
      await openEventDetail.bind(this)(feature);
    } else if (!onCluster) {
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
  setSpiderFeatureState.bind(this)(this.selectedId, { selected: false });
  this.selectedId = featureId;
  setFeatureState.bind(this)(this.selectedId, { selected: true });
  setSpiderFeatureState.bind(this)(this.selectedId, { selected: true });

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
  setSpiderFeatureState.bind(this)(this.selectedId, { selected: false });
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
