<template>
    <!-- Row Code here -->
    <div class="grid-item1" :id="case_id">{{ case_id }}</div>
    <div class="grid-item2" :id="case_id">{{ guid }}</div> 
    <button class="subitem1" style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke; font-size:x-large;"><i class="bi bi-trash-fill"></i></button>
    <!-- <p>CaseID: {{ case_id }} | GUID: {{ guid }}</p> -->
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
// const data: Ref<{caseID: string, guid: string}> = ref('Parent');
const props = defineProps(['case_id', 'guid']);
</script>

<style scoped>
.subitem1 {
    grid-column: 3/3;
    
}

.grid-item1 {
    background-color: #f3f3f3;
    border: 1px solid #adadad;
    padding: 20px;
    font-size: 20px;
    text-align: center;
    grid-column: 1;   
}

.subitem1:hover {
  background-color: crimson;
  scale: 105%;
  transition: ease 0.5s;
}

.grid-item2 {
    background-color: #f3f3f3;
    border: 1px solid #adadad;
    padding: 20px;
    font-size: 20px;
    text-align: center;
    grid-column: 2;
}
</style>