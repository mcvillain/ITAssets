<template>
    <!-- Table Code Here -->
     <div class="table-container">
        <mainTableRow @data="row" v-for="row in rows" />
     </div>
</template>

<script lang="ts" setup>
import mainTableRow from './mainTableRow.vue';
let rows = [{caseID:"12345", guid:"HEHUIWEFHUIF"}];
</script>