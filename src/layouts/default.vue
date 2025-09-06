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
//
</script>
