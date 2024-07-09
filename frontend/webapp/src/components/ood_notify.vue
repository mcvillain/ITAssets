<template>
    <div :style="position_style" id="ood"><div :style="colour_style">CACHED DATA</div></div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { sidebarWidth } from './state.js';
import { useTheme } from 'vuetify';
const theme = useTheme();
const background_colour = computed(() => theme.global.current.value.dark ? '#ECE81A' : '#ECE81A');
const colour_style = ref({'color': 'black', 'background-color': background_colour, 'width': '100%', 'height': '100%', 'padding': '0.5rem'});
const offset = computed(() => `${Number.parseInt(sidebarWidth.value.substring(0, -2)) + 32}px`);
const position_style = ref({ 'left': offset });
</script>
<style scoped>
#ood {
    position: fixed;
    margin-left: 1rem;
    top: 2rem;
    /* padding: 0.5rem; */
    /* background-color: #ECE81A; */
}
</style>