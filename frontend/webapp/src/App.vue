<template>
  <sidebar />
  <div class="main-app" :style="{ 'margin-left': sidebarWidth }">
    <v-app>
      <v-main>
        <RouterView />
      </v-main>
    </v-app>
  </div>
</template>

<script setup lang="js">
import sidebar from './components/sidebar.vue'
import { sidebarWidth } from './components/state.js'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@media print {
  .main-app {
    margin: none !important;
    margin-left: 0 !important;
  }
}
</style>
