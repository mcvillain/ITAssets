/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
const vuetify = createVuetify({
    components, directives, theme: {defaultTheme: 'dark'}
});

// Plugins
// import { registerPlugins } from '@/plugins'

// Routers
import router from './components/router/index.js'

const app = createApp(App)
app.use(vuetify);

app.use(router)

// registerPlugins(app)

app.mount('#app')
