<template>
  <div class="grid-container">
    <div class="header">CaseID:</div>
    <div class="header">GUID:</div>
    <mainTableRow :case_id="row.caseID" :guid="row.guid" v-for="row in rows" />
  </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue';
import mainTableRow from './mainTableRow.vue';
let rows = [
  { caseID: "12345", guid: "HEHUIWEFHUI" },
  { caseID: "45678", guid: "HEHIGUHOFGF" },
  { caseID: "91011", guid: "HIUIHOASDDF" },
  { caseID: "32167", guid: "HUISDSHDYUY"},
  { caseID: "37829", guid: "HUFHUWHHEH"}
];
const props = defineProps(['table_data_endpoint']);

onMounted(() => {
  fetch(import.meta.env.VITE_API_ENDPOINT + props.table_data_endpoint, {
    credentials: "include",
  })
    .then(response => response.json())
    .then(data => {
      rows = data;
    })
    .catch(error => {
      console.error('Error fetching server data:', error);
    });
});
</script>


<style scoped>
.grid-container {
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: inline-grid;
  grid-template-columns: 500px 500px 100px;
  background-color: #ef3b32;
  padding-bottom: 15px;
  max-width: 100%;
  align-self: center;
  border-radius: 1rem;
}

.header {
  padding: 20px;
  font-size: 20px;
  text-align: center;
  Color: white;
}
</style>