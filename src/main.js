/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import { useAppStore } from '@/stores/app'

const app = createApp(App)

registerPlugins(app)
    .then(async () => {
        // Mount app first to initialize Pinia and show loading overlay
        app.mount('#app')

        // Then check GPS access - this will hide loading screen when done
        const appStore = useAppStore()
        await appStore.checkGpsAccess()
    })
    .catch((err) => {
        console.error('Plugins bootstrap failed:', err)
        // Mount app anyway but hide loading screen
        app.mount('#app')
        const appStore = useAppStore()
        setTimeout(() => {
            appStore.setLoading(false)
        }, 2000)
    })
