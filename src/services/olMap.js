import Map from 'ol/Map' // import klasy Map z biblioteki OpenLayers. Odpowiada za tworzenie mapy w naszym widoku HTML

import View from 'ol/View' // import klasy View z biblioteki OpenLayers. Odpowiada za widok mapy, jej centrum i poziom powiększenia (zoom)

import TileLayer from 'ol/layer/Tile' // import klasy TileLayer z biblioteki OpenLayers. Odpowiada za warstwę kafelkową, podkładową (tile layer) w naszej mapie

import XYZ from 'ol/source/XYZ' // import klasy XYZ z biblioteki OpenLayers. Odpowiada za źródło danych XYZ (np. OpenStreetMap) dla warstwy kafelkowej
import { fromLonLat } from 'ol/proj' // import funkcji fromLonLat z biblioteki OpenLayers. Odpowiada za przekształcanie współrzędnych z systemu geograficznego (lon/lat) na projekcję mapy

let map = null // ta zmienna będzie przechowywać naszą mapę i sterować jej zachowaniem

const DEFAULT_CENTER = fromLonLat([16.62, 50.69]) // współrzędne stopniowe, okolice Piskorzowa / Pieszyc
const DEFAULT_ZOOM = 12 // tak możemy zapisywać domyślne ustawienia mapy

export const createMap = (targetEl, options = {}) => {
    if (map) {
        // jeśli mapa istnieje (singleton), tylko przypnij do nowego kontenera
        if (targetEl) {
            map.setTarget(targetEl)
        }
        return map
    }

    // tworzymy nową mapę
    map = new Map({
        target: targetEl, // element HTML, w którym ma być wyświetlana mapa
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    maxZoom: 20,
                }),
            }),
        ],
        view: new View({
            center: options.center || DEFAULT_CENTER, // jeśli podamy w opcjach center, to je użyjemy, w przeciwnym razie domyślne
            zoom: options.zoom ?? DEFAULT_ZOOM, // analogicznie z zoom
        }),
        controls: [], // bez kontrolek (przycisków do zoom, pełny ekran itp.)
    })
    return map
}

export const getMap = () => {
    // ta metoda będzie nam złużyła do sterowania mapą z innych miejsc w aplikacji
    return map
}
