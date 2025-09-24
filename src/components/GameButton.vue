<template>
    <v-btn
        :icon="icon && !label ? true : false"
        variant="elevated"
        size="small"
        rounded="lg"
        @click="action"
        :title="$t(title)"
        elevation="2"
        :color="color"
        :height="height"
    >
        <v-icon
            v-if="icon"
            :icon="icon"
            :class="label ? 'mr-2' : ''"
        ></v-icon>
        <span v-if="label">{{ $t(label) }}</span>
    </v-btn>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: 'primary',
    },
    icon: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    height: {
        type: [Number, String],
        default: '40',
    },
    action: {
        type: Function,
        default: () => {},
    },
})
</script>
