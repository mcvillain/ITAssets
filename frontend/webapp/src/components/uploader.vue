<template>
  <notification />
  <div id="server-bar" class="d-flex flex-column w-100"
    style="justify-content: center; align-content: center; margin: 4rem;">
    <h2 style="align-content: center; margin: .5rem; font-size: xx-large;">Case ID Uploader</h2>
    <div class="my-2">
      <input  id="caseID" type="text" placeholder="Case ID"
        style="border: 1px black solid; border-radius: 1rem; padding:.25rem; text-align: center;" />
    </div>
    <div>
      <button id="postBtn" @click="postCaseID()"
        style="border: 1px #e92e2e solid; border-radius: 1rem; padding: .25rem; background-color: crimson; color: whitesmoke;">Jared
        Button</button>
    </div>
    <div>
      <input id="url" type="text" placeholder="URL To Be Posted Here:"
        style="border: 1px black solid;  padding:.25rem; text-align: center; margin: 1rem; border-top-left-radius: 1rem; border-top-right-radius: 1rem;" />
    </div>
    <div>
      <button @click="copyMyText()"
        style="border: 1px #e92e2e solid; padding: .25rem; background-color: #dc143c; color: whitesmoke; border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem;">Copy
        To Clipboard</button>
    </div>
    
    <div
      style="background-color: black; width: 75%; height: .1rem; margin-left: auto; margin-right: auto; margin-top: 1rem;">
    </div>
    <div class="grid-container">
      <div class="grid-item" id="1">1</div>
      <div class="grid-item" id="2">2</div>
      <div class="grid-item" id="3">3</div>
      <div class="grid-item" id="4">4</div>
      <div class="grid-item" id="5">5</div>
      <div class="grid-item" id="6">6</div>
      <div class="grid-item" id="7">7</div>
      <div class="grid-item" id="8">8</div>
      <div class="grid-item" id="9">9</div>
      <div class="grid-item" id="9">10</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import notification from './notification.vue';
//import { ref, Ref} from 'vue'
//<input type="text" v-model="search" placeholder="Search Servers" />
//const search: Ref<string> = ref('')

const caseID = document.getElementById("caseID");
// const postBtn = document.getElementById("postBtn");


function postCaseID() {
  alert();
}

function copyMyText() {

}

// fetch()
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(userData => {
//     // Process the retrieved user data
//     console.log('User Data:', userData);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

</script>

<style scoped>
.grid-container {
  margin-top: 2rem;
  display: inline-grid;
  grid-template-columns: auto auto ;
  background-color: #e92e2e;
  padding: 10px;
  max-width: 100%;
  align-self: center;
  width: 100rem;
  border-radius: 1rem;
}

.grid-item {
  background-color: #f3f3f3;
  border: 1px solid #adadad;
  padding: 20px;
  font-size: 20px;
  text-align: center;
}
</style>