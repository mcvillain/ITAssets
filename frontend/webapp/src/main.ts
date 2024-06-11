/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Routers
import router from './components/router/index.js'

const app = createApp(App)

app.use(router)

registerPlugins(app)

app.mount('#app')
