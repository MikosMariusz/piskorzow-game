<template>
    <v-app-bar :image="bg">
        <v-toolbar-title>{{ $t('gameTitle') }}</v-toolbar-title>
    </v-app-bar>
</template>

<script setup>
const bg = new URL('../assets/images/bar-background.png', import.meta.url).href
</script>
