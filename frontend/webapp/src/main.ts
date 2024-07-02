/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

// Routers
import router from "./components/router/index.js";

// import "vuetify/styles";
// import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

const app = createApp(App);

app.use(router);

// const vuetify = createVuetify({
//     components,
//     directives,
// });

// createApp(App).use(vuetify).mount("#app");

registerPlugins(app);

app.mount("#app");
