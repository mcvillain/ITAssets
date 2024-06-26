<template>
    <!-- Row Code here -->
    <div class="grid-item1" :id="case_id">{{ case_id }}</div>
    <div class="grid-item2" :id="case_id">{{ guid }}</div> 
    <button class="subitem1"><i class="bi bi-trash-fill"></i></button>
    <!-- <p>CaseID: {{ case_id }} | GUID: {{ guid }}</p> -->
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
// const data: Ref<{caseID: string, guid: string}> = ref('Parent');
const props = defineProps(['case_id', 'guid']);
</script>

<style scoped>
.subitem1 {
    grid-column: 3;
    /* border-top-right-radius: 1rem ;
    border-bottom-right-radius: 1rem ; */
    /* border: 1px #e92e2e solid;  */
    padding: .25rem; 
    background-color: #f1f1f1;
    color: crimson; 
    font-size:x-large;
}

.subitem1:hover {
  background-color: rgb(182, 15, 49);
  color: whitesmoke;
  scale: 105%;
  transition: ease 0.5s;
}

.grid-item1 {
    background-color: #f1f1f1;
    padding: 20px;
    font-size: 20px;
    text-align: center;
    grid-column: 1;   
}

.grid-item1:hover, .grid-item2:hover {
  background-color: #E4E3E3;
}

.grid-item2 {
    background-color: #f1f1f1;
    padding: 20px;
    font-size: 20px;
    text-align: center;
    grid-column: 2;
}
</style>