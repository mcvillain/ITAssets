<template>
    <v-chip :color="theme.global.current.value.dark?'yellow':'yellow-darken-3'" text="Cached Data" class="text-uppercase" style="margin-left: 1rem; margin-right: 1rem;" size="small" label></v-chip>
    <!-- #ECE81A -->
</template>
<script lang="ts" setup>
import { useTheme } from 'vuetify';
const theme = useTheme();
</script>
<style scoped>
</style>