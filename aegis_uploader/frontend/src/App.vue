<template>
  <div class="container index-container">
    <img v-show="agreed" alt="Aegis logo" class="logo" src="./assets/aegis-header-logo-en.svg" height="125" />

    <!-- Modal -->
    <TransparentModal style="max-width: 75%;" :visible="showModal">
      <h1 class="modal-header HKGrotesk-Bold">Aegis Uploader Terms of Service</h1>
      <p class="modal-text HKGrotesk-Regular">By clicking "Agree" below, you consent to allow Aegis Software to store and process the personal information submitted above to provide you support as an Aegis Software customer currently covered under an active service contract.</p>
      <div style="display: flex; flex-direction: row; justify-content: end; width: 100%;">
        <button class="agree-button HKGrotesk-Regular" @click="handleAgree">Agree</button>
      </div>
    </TransparentModal>
    <ErrorModal v-if="showErrorModal">
      <h1 class="modal-header HKGrotesk-Bold">Error</h1>
      <p class="modal-text HKGrotesk-Regular">{{ error_message }}</p>
    </ErrorModal>

    <!-- Uppy component and Aegis logo -->
    <div v-if="agreed" class="content">
      <div class="uppy-and-logo">
        <UppyEnvironment :upload_guid="upload_guid" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UppyEnvironment from './components/UppyEnvironment.vue';
import TransparentModal from './components/TransparentModal.vue';
import ErrorModal from './components/ErrorModal.vue';

const showModal = ref(true); // Show modal initially
const agreed = ref(false);   // Track if user has agreed
const showErrorModal = ref(false);
const error_message = ref("");

const params = new URLSearchParams(document.location.search);
const upload_guid = ref(params.get('id') as string);
fetch(`/api/validate_case_id/${upload_guid.value}`)
  .then(async res => {
    if (!res.ok) {
      showModal.value = false;
      showErrorModal.value = true;
      if (res.status == 400) {
        if ((await res.text()) == 'itar')
          error_message.value = "This upload is tagged as containing ITAR data. Please ask the customer support representative for the ITAR upload link.";
        else
          error_message.value = "This upload is not tagged as containing ITAR data. Please ask the customer support representative for the non-ITAR upload link.";
      } else {
        error_message.value = "This upload URL has expired or does not exist";
      }
    } else {
      const data = await res.json();
      if (data.itar == true) {
        console.log("ITAR");
        // TODO: Do something with this information... ex: load a different header svg
      }
    }
  })
  .catch(err => {
    console.error(err);
    showModal.value = false;
    showErrorModal.value = true;
    error_message.value = "Error verifying the upload URL";
  });

const closeModal = () => {
  showModal.value = false; // Close modal
};

const handleAgree = () => {
  agreed.value = true; // Set agreed to true to show uppy and Aegis logo
  closeModal(); // Close modal after agreeing
};
</script>

<style scoped>
.container {

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
</style>

<style>
.modal-header {
  color: #27272D !important;
  font-size: 28px !important;
}

.modal-text {
  color: #000 !important;
  font-size: 16px !important;
  line-height: 24px !important;
}

.agree-button {
  background-color: #15779F !important;
  border-radius: 5px !important;
  color: #F1F1F1 !important;
  margin-left: auto !important;
  border: 0 !important;
}

.content {
  text-align: center;
  margin-top: 20px;
  /* Adjust margin as needed */

}

.uppy-Root {
  position: static !important;
  font-family: "Hanken Grotesk", sans-serif !important;
  font-optical-sizing: auto !important;
  font-weight: normal;
  font-style: normal;
}

.logo {
  display: flex;
  justify-content: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;

}

#app {
  display: flex !important;
  margin: 2rem;
}

body {
  flex-direction: column;
  background-color: #16181D !important;
}

/* FONTS */
.HKGrotesk-Regular {
  font-family: "Hanken Grotesk", sans-serif;
  font-optical-sizing: auto;
  font-weight: normal;
  font-style: normal;
}

.HKGrotesk-Bold {
  font-family: "Hanken Grotesk", sans-serif !important;
  font-optical-sizing: auto !important;
  font-weight: bold !important;
  font-style: normal !important;
}
</style>
