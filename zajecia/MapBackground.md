## Zadanie 1 - Tło mapy, widok gry terenowej

1.  Instalacja biblioteki OpenLayers

    Aby rozpocząć pracę z mapami w aplikacji webowej, musimy najpierw zainstalować bibliotekę OpenLayers. Możemy to zrobić za pomocą npm terminalu. Ustawiamy terminal, tak, żeby na końcu ścieżki był folder 'piskorzow-game' i wpisujemy poniższą komendę:

    ```bash
    npm install ol
    ```

2.  Dodanie mapy do projektu. Musimy utworzyć serwis, który będzie ładował mapę do naszej aplikacji. Dodaj folder `services` w folderze `src`, a następnie w tym folderze utwórz plik `olMap.js`. W tym pliku dodaj poniższy kod:

    ```javascript
    import Map from 'ol/Map' // import klasy Map z biblioteki OpenLayers. Odpowiada za tworzenie mapy w naszym widoku HTML

    import View from 'ol/View' // import klasy View z biblioteki OpenLayers. Odpowiada za widok mapy, jej centrum i poziom powiększenia (zoom)

    import TileLayer from 'ol/layer/Tile' // import klasy TileLayer z biblioteki OpenLayers. Odpowiada za warstwę kafelkową, podkładową (tile layer) w naszej mapie

    import XYZ from 'ol/source/XYZ' // import klasy XYZ z biblioteki OpenLayers. Odpowiada za źródło danych XYZ (np. OpenStreetMap) dla warstwy kafelkowej

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
    ```

3.  Następnie dodajmy komponent Vue, który będzie wyświetlał naszą mapę. W folderze `src/components` utwórz plik `MapBackground.vue` i dodaj do niego poniższy kod:

    ```javascript
    <template>
      <div ref="mapContainer" class="app-map-bg"></div>
    </template>

    <script setup>
    import { onMounted, onBeforeUnmount, ref } from 'vue'
    import { createMap } from '../services/olMap' // importujemy funkcję tworzącą mapę

    const mapContainer = ref(null) // referencja do kontenera mapy
    let mapInstance = null // zmienna do przechowywania instancji mapy

    onMounted(() => {
      // kiedy komponent jest zamontowany, tworzymy mapę
      mapInstance = createMap(mapContainer.value)
    })

    onBeforeUnmount(() => {
      // kiedy komponent jest odmontowywany, usuwamy mapę
      if (mapInstance) {
        mapInstance.setTarget(null)
        mapInstance = null
      }
    })

    </script>

    <style scoped>
    .app-map-bg {
        position: fixed;
        width: 100dvw;
        height: 100dvh;
        z-index: 0;
    }   /* takie style css pozwolą nam zawsze ustawić mapę pod innymi elementami */
    </style>
    ```

4.  Teraz możemy użyć komponentu `MapBackground` w naszej aplikacji. Do tego użyjemy pliku 'layouts/default.vue'. Otwórz ten plik i zastąp jego zawartość poniższym kodem:

    ```javascript
    <template>
        <v-main>
            <router-view />
        </v-main>
        <MapBackground
            :interactive="true"
            :z-index="0"
        />
    </template>

    <script setup>
    import MapBackground from '@/components/MapBackground.vue'
    </script>
    ```
