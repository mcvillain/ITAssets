<template>
  <sidebar />
  <div class="main-app" :style="{ 'margin-left': sidebarWidth }">
    <v-app>
      <v-main>
        <!--<notification/>-->
        <!--<dare/>-->
        <RouterView />
      </v-main>
    </v-app>
  </div>
</template>

<script setup lang="js">
//import dare from './components/open.vue'
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
  /* margin-top: 60px; */
}

@media print {
  .main-app {
    margin: none !important;
    margin-left: 0 !important;
  }
}
</style>
