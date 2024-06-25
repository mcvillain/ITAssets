<template>
  <!-- Table Code Here -->
  <!-- <div class="grid-container">
    <div class="header">Header 1:</div>
    <div class="header">Header 2:</div>
    <div class="grid-item1" id="1">1</div>
    <div class="grid-item2" id="1">1</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="2">2</div>
    <div class="grid-item2" id="2">2</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="3">3</div>
    <div class="grid-item2" id="3">3</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="4">4</div>
    <div class="grid-item2" id="4">4</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="5">5</div>
    <div class="grid-item2" id="5">5</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="6">6</div>
    <div class="grid-item2" id="6">6</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="7">7</div>
    <div class="grid-item2" id="7">7</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="8">8</div>
    <div class="grid-item2" id="8">8</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="9">9</div>
    <div class="grid-item2" id="9">9</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
    <div class="grid-item1" id="10">10</div>
    <div class="grid-item2" id="10">10</div> <button class="subitem1"
      style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:large;">Delete</button>
  </div> -->
  <div class="grid-container">
    <div class="header" style="font-size:x-large;">CaseID:</div>
    <div class="header" style="font-size: x-large;">GUID:</div>
    <mainTableRow :case_id="row.caseID" :guid="row.guid" v-for="row in rows" />
  </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue';
import mainTableRow from './mainTableRow.vue';
let rows = [{ caseID: "12345", guid: "HEHUIWEFHUIF" }];
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
  display: inline-grid;
  grid-template-columns: auto auto 100px;
  background-color: #e92e2e;
  padding: 10px;
  max-width: 100%;
  align-self: center;
  width: 100rem;
  border-radius: 1rem;
}

.header {
  background-color: #e92e2e;
  padding: 20px;
  font-size: 20px;
  text-align: center;
  Color: white;
}
</style>