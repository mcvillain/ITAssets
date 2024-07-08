<template>
    <div :style="position_style" id="ood">CACHED DATA</div>
</template>
<script lang="ts" setup>
import {computed, ref} from 'vue';
import { sidebarWidth } from './state.js';
const offset = computed(() => `${Number.parseInt(sidebarWidth.value.substring(0, -2))+32}px`);
const position_style = ref({'left': offset});
</script>
<style scoped>
#ood {
    position: fixed;
    margin-left: 1rem;
    top: 2rem;
    padding: 0.5rem;
    background-color: #ECE81A;
}
</style>