<template>
    <div class="home-layer">
        <v-container
            class="pa-1 h-100"
            fluid
        >
            <v-row
                class="justify-center align-center tiles-wrapper h-100"
                no-gutters
            >
                <v-col
                    v-for="tile in tiles"
                    :key="tile.id"
                    cols="12"
                    sm="6"
                    md="6"
                    lg="6"
                    xl="4"
                    class="d-flex justify-center align-center pa-0"
                >
                    <v-card
                        class="glass-card tile-card position-relative"
                        role="button"
                        elevation="8"
                        tabindex="0"
                        rounded="lg"
                        @click="go(tile.route)"
                        @keyup.enter.space="go(tile.route)"
                    >
                        <div class="tile-content position-relative w-100 h-100">
                            <!-- Obrazek w tle -->
                            <v-img
                                v-if="tile.image"
                                :src="tile.image"
                                :alt="tile.alt"
                                cover
                                height="100%"
                                width="100%"
                                class="position-absolute"
                                style="top: 0; left: 0"
                            />

                            <!-- Tekst zastępczy (gdy brak obrazka) -->
                            <div
                                v-else
                                class="h-100 w-100 d-flex align-center justify-center pa-2 text-center text-white font-weight-medium fallback-text"
                            >
                                {{ tile.fallbackText }}
                            </div>

                            <!-- Etykieta z tytułem -->
                            <div
                                class="position-absolute d-flex align-center justify-center"
                                style="
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    z-index: 2;
                                "
                            >
                                <v-sheet
                                    class="tile-label-sheet pa-2"
                                    elevation="4"
                                    rounded="lg"
                                >
                                    <p class="text-center tile-title font-weight-light ma-1">
                                        {{ getTileTitle(tile) }}
                                    </p>
                                </v-sheet>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const tiles = [
    {
        id: 'game',
        title: 'terrainGame',
        route: '/game',
        image: new URL('../assets/images/gra_terenowa_logo.png', import.meta.url).href,
        alt: 'terrainGame',
        fallbackText: 'terrainGame',
    },
    {
        id: 'presentation',
        title: 'villagePresentation',
        route: '/presentation',
        image: new URL('../assets/images/interaktywna_prezentacja.png', import.meta.url).href,
        alt: 'villagePresentation',
        fallbackText: 'villagePresentation',
    },
]

function go(path) {
    router.push(path)
}

function getTileTitle(tile) {
    return t(tile.title)
}
</script>

<style>
.home-layer {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1200;
    overflow: hidden;
}

.tile-card {
    pointer-events: auto;
    width: 100%;
    max-width: 450px;
    aspect-ratio: 1;
    overflow: hidden;
    transition:
        transform 0.25s,
        box-shadow 0.25s,
        background 0.25s;
    margin: 0.25rem;
}

.glass-card {
    background: rgba(255, 255, 255, 0.08) !important;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.tile-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.6);
}

.tile-label-sheet {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 90%;
}

.tile-title {
    font-size: clamp(0.9rem, 3.5vw, 1.5rem);
    line-height: 1.2;
    text-align: center;
}

/* Telefon pionowo */
@media (max-width: 599px) {
    .tile-card {
        max-width: min(85vw, 320px);
        min-height: min(85vw, 320px);
    }

    .tile-title {
        font-size: clamp(0.8rem, 4vw, 1.1rem) !important;
    }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 959px) {
    .tile-card {
        max-width: min(42vw, 280px);
        min-height: min(42vw, 280px);
    }
}

/* Desktop */
@media (min-width: 1280px) {
    .tile-card {
        max-width: min(35vw, 450px);
        min-height: min(35vw, 450px);
    }
}
</style>
