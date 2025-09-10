<template>
    <div
        ref="mapContainer"
        class="app-map-bg"
    ></div>
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
} /* takie style css pozwolą nam zawsze ustawić mapę pod innymi elementami */
</style>
