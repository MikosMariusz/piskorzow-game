<template>
    <v-btn
        :icon="icon && !label ? true : false"
        variant="elevated"
        size="small"
        rounded="lg"
        @click="action"
        :title="$t(title)"
        class="mr-2"
        elevation="2"
        color="primary"
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

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        color?: string
        icon?: string
        title: string
        label?: string
        height?: number | string
        action: () => void
    }>(),
    {
        color: 'primary',
        height: '40',
    },
)
</script>
