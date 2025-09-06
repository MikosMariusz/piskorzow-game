<!-- src/components/MapBackground.vue -->
<template>
    <div
        ref="mapEl"
        class="app-map-bg"
        :style="{
            zIndex: String(zIndex),
            pointerEvents: interactive ? 'auto' : 'none',
        }"
    />
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createMap, detach, setTarget, updateSize } from '@/services/olMap'

const props = defineProps({
    interactive: { type: Boolean, default: true },
    zIndex: { type: [Number, String], default: 0 }, // tło; treść aplikacji niech ma >0
    center: { type: Array, default: () => [16.62, 50.69] }, // lon, lat (WGS84)
    zoom: { type: Number, default: 12 },
})

const mapEl = ref(null)
let ro = null

onMounted(async () => {
    await nextTick()
    createMap(mapEl.value, {
        center: undefined, // domyślne w serwisie (lub możesz przeliczyć tu fromLonLat)
        zoom: props.zoom,
    })

    // gwarantujemy poprawny rozmiar po pierwszym renderze
    updateSize()

    // automatyczne aktualizacje rozmiaru
    ro = new ResizeObserver(() => updateSize())
    ro.observe(mapEl.value)

    window.addEventListener('resize', updateSize, { passive: true })
})

onBeforeUnmount(() => {
    if (ro) ro.disconnect()
    window.removeEventListener('resize', updateSize)
    // odczep mapę od DOM, ale zachowaj instancję (szybkie re-mount między widokami)
    detach()
})

// Jeżeli chcesz dynamicznie przepinać target (np. keep-alive), uwzględniamy to:
watch(
    () => mapEl.value,
    (el) => {
        if (el) setTarget(el)
    },
)
</script>

<style scoped>
.app-map-bg {
    position: fixed;
    inset: 0; /* top:0; right:0; bottom:0; left:0 */
    width: 100dvw;
    height: 100dvh;
    /* Upewnij się, że nic nie przykrywa mapy tłem */
    background: transparent;
}
</style>
