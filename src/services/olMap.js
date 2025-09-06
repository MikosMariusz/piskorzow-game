import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
// src/services/olMapService.js
import Map from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import View from 'ol/View'

let _map = null
let _vectorSource = null
let _vectorLayer = null

const DEFAULT_CENTER = fromLonLat([16.62, 50.69]) // okolice Piskorzowa / Pieszyc
const DEFAULT_ZOOM = 12

function makeDefaultStyle (opts = {}) {
  const {
    strokeColor = 'rgba(33,150,243,0.9)',
    fillColor = 'rgba(33,150,243,0.15)',
    pointFill = '#2196f3',
    pointStroke = '#ffffff',
  } = opts

  return new Style({
    stroke: new Stroke({ color: strokeColor, width: 2 }),
    fill: new Fill({ color: fillColor }),
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: pointFill }),
      stroke: new Stroke({ color: pointStroke, width: 2 }),
    }),
  })
}

export function createMap (targetEl, options = {}) {
  if (_map) {
    // jeśli mapa istnieje (singleton), tylko przypnij do nowego kontenera
    if (targetEl) {
      _map.setTarget(targetEl)
    }
    return _map
  }

  _vectorSource = new VectorSource()
  _vectorLayer = new VectorLayer({
    source: _vectorSource,
    style: makeDefaultStyle(options.style),
  })

  _map = new Map({
    target: targetEl || undefined,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 20,
        }),
      }),
      _vectorLayer,
    ],
    view: new View({
      center: options.center || DEFAULT_CENTER,
      zoom: options.zoom ?? DEFAULT_ZOOM,
    }),
    // jako tło zwykle bez kontrolek; w razie potrzeby dodaj je w komponencie
    controls: [],
  })

  return _map
}

export function getMap () {
  return _map
}

export function detach () {
  // Odczep render od DOM (np. przy zmianie routingu), ale zostaw instancję
  if (_map) {
    _map.setTarget(null)
  }
}

export function setTarget (targetEl) {
  if (_map) {
    _map.setTarget(targetEl)
  } else {
    createMap(targetEl)
  }
}

export function updateSize () {
  if (_map) {
    _map.updateSize()
  }
}

export function setView ({ centerLonLat, zoom, duration = 300 }) {
  if (!_map) {
    return
  }
  const view = _map.getView()
  if (centerLonLat) {
    view.animate({ center: fromLonLat(centerLonLat), duration })
  }
  if (typeof zoom === 'number') {
    view.animate({ zoom, duration })
  }
}

export function addGeoJSON (geojson, { style = null } = {}) {
  if (!_vectorSource || !_map) {
    return []
  }
  const features = new GeoJSON().readFeatures(geojson, {
    featureProjection: _map.getView().getProjection(),
  })
  if (style) {
    for (const f of features) {
      f.setStyle(style)
    }
  }
  _vectorSource.addFeatures(features)
  return features
}

export function addFeature (feature) {
  if (!_vectorSource) {
    return null
  }
  _vectorSource.addFeature(feature)
  return feature
}

export function clearFeatures () {
  _vectorSource?.clear()
}

export function fitToSource (padding = [48, 48, 48, 48], maxZoom = 17) {
  if (!_map || !_vectorSource || _vectorSource.getFeatures().length === 0) {
    return
  }
  const extent = _vectorSource.getExtent()
  _map.getView().fit(extent, { padding, maxZoom, duration: 350 })
}

export function setVectorStyle (styleOptions = {}) {
  if (_vectorLayer) {
    _vectorLayer.setStyle(makeDefaultStyle(styleOptions))
  }
}
