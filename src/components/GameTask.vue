<template>
    <div class="game-task">
        <div
            v-if="hasAccuracy"
            key="task"
        >
            <div class="task-text mb-3">
                {{ $t(task.question) }}
            </div>
            <v-img
                v-if="task.image"
                :src="`/stories/${storyId}/${task.image.src}`"
                :alt="task.image.alt || 'Obraz'"
                class="rounded-sm elevation-4 mb-4"
                :style="task.image.blur ? 'filter: blur(3px);' : ''"
                contain
            />
            <v-carousel
                v-else-if="task.images && task.images.length > 0"
                class="rounded-sm elevation-4 mb-3"
                hide-delimiter-background
                crossfade
                show-arrows="hover"
            >
                <v-carousel-item
                    v-for="(image, imageIndex) in task.images"
                    :key="imageIndex"
                    :src="`/stories/${storyId}/${image.src}`"
                    :alt="image.alt || 'Obraz'"
                    cover
                ></v-carousel-item>
            </v-carousel>
            <v-text-field
                v-if="task.answers"
                v-model="answer"
                :label="$t('task.yourAnswer')"
                density="compact"
                variant="outlined"
                class="mb-2"
                :class="{ 'success-field': isCorrect }"
                @focus="showTipLink = true"
                :error="answer.length > 0 && !isCorrect"
                :success="isCorrect"
                :rules="validationRules"
                :prepend-inner-icon="isCorrect ? 'mdi-thumb-up-outline' : undefined"
            />

            <div
                v-if="task.tip"
                class="tip-link mb-1"
            >
                <a
                    v-if="!showTip"
                    href="#"
                    @click.prevent="showTip = true"
                    >{{ $t('task.showTip') }}</a
                >
            </div>
            <v-alert
                v-if="showTip && task.tip"
                type="info"
                variant="tonal"
            >
                {{ $t(task.tip) }}
            </v-alert>
        </div>
        <div
            v-else
            key="message"
            class=""
        >
            <v-alert
                color="warning"
                variant="tonal"
                class="mb-3"
            >
                <div class="text-center">
                    <div
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 16px;
                        "
                    >
                        <v-icon
                            size="48"
                            class="mb-2"
                            :style="`transition: transform 0.3s; transform: rotate(${arrowAngle}deg);`"
                            >mdi-arrow-up-bold</v-icon
                        >
                        <div>
                            <div class="text-h6 mb-2">{{ $t('task.approachTarget') }}</div>
                            <div class="text-h4 font-weight-bold">
                                {{ remainingDistance }} {{ $t(distanceUnit) }}
                            </div>
                        </div>
                    </div>
                </div>
            </v-alert>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { getDistance } from 'ol/sphere'
import { setDirectionCallback, startHeadingTracking, stopHeadingTracking } from '@/services/gps'

const appStore = useAppStore()
const { t } = useI18n()

const props = defineProps({
    storyId: {
        type: String,
        required: true,
    },
    task: {
        type: Object,
        required: true,
    },
    accuracy: {
        type: Number,
        required: false,
        default: null,
    },
    position: {
        type: Array,
        required: false,
        default: null,
    },
})
const emit = defineEmits(['task-completed', 'answer-correct'])
const answer = ref('')
const showTip = ref(false)
const showTipLink = ref(false)
const hasAccuracy = ref(false)
const remainingDistance = ref(0)
const arrowAngle = ref(0)

const isCorrect = computed(() => {
    if (props.task.answers && Array.isArray(props.task.answers)) {
        return props.task.answers.some(
            (ans) =>
                typeof ans === 'string' &&
                answer.value.trim().toLowerCase() === ans.trim().toLowerCase(),
        )
    } else {
        if (props.position && props.accuracy && !appStore.getUserGpsPosition) {
            return false
        }
        computeAccuracy()
        return hasAccuracy.value
    }
})

const distanceUnit = computed(() => {
    const dist = remainingDistance.value
    if (dist === 1) return 'task.meter'
    if (dist % 10 >= 2 && dist % 10 <= 4 && (dist % 100 < 10 || dist % 100 >= 20))
        return 'task.metersTwo'
    return 'task.meters'
})

const validationRules = computed(() => {
    return [
        (value) => {
            if (!value || value.trim() === '') return true

            const correct = props.task.answers?.some(
                (ans) =>
                    typeof ans === 'string' &&
                    value.trim().toLowerCase() === ans.trim().toLowerCase(),
            )

            if (!correct && props.task.incorrectMessage) {
                return t(props.task.incorrectMessage)
            }

            return true
        },
    ]
})

const computeAccuracy = () => {
    if (import.meta.env.MODE === 'development') {
        return (hasAccuracy.value = true)
    }
    if (!props.position || !props.accuracy || !appStore.getUserGpsPosition) {
        return (hasAccuracy.value = true)
    }

    const userCoord = [appStore.getUserGpsPosition.lon, appStore.getUserGpsPosition.lat]

    if (!userCoord[0] || !userCoord[1]) {
        return (hasAccuracy.value = false)
    }

    const gpsAccuracy = appStore.getUserGpsPosition.accuracy || 10
    const distance = getDistance(userCoord, props.position)
    const effectiveDistance = Math.max(0, distance - gpsAccuracy)
    remainingDistance.value = Math.ceil(effectiveDistance - props.accuracy)
    return (hasAccuracy.value = effectiveDistance <= props.accuracy)
}

onMounted(() => {
    if (props.position) {
        setDirectionCallback(({ arrowAngle: angle }) => {
            arrowAngle.value = angle
        })
        startHeadingTracking(props.position)
    }
})

onUnmounted(() => {
    stopHeadingTracking()
})

watch(
    isCorrect,
    (newValue) => {
        if (newValue === true) {
            if (navigator.vibrate) {
                navigator.vibrate(100)
            }
            emit('task-completed', newValue)
        }
    },
    { immediate: true },
)

watch(
    () => appStore.getUserGpsPosition,
    () => {
        computeAccuracy()
    },
    { immediate: true },
)
</script>

<style scoped>
.accuracy-message {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.task-transition-enter-active,
.task-transition-leave-active {
    transition: all 0.5s ease;
}

.task-transition-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.task-transition-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.task-transition-enter-to,
.task-transition-leave-from {
    opacity: 1;
    transform: translateY(0);
}
.tip-link {
    font-size: 0.9em;
}
.tip-link a {
    color: #1976d2;
    cursor: pointer;
    text-decoration: underline;
}
.tip-text {
    margin-top: 4px;
    color: #757575;
}

.success-field :deep(.v-field) {
    background-color: rgba(76, 175, 80, 0.08);
    border-color: #4caf50 !important;
}

.success-field :deep(.v-field--focused) {
    border-color: #4caf50 !important;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.success-field :deep(.v-field__prepend-inner .v-icon) {
    color: #4caf50;
    animation: thumbUp 0.5s ease-in-out;
}

@keyframes thumbUp {
    0% {
        transform: scale(0) rotate(-10deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.2) rotate(5deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}
</style>
