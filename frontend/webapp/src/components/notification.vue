<script>
import { onMounted, ref } from 'vue';
import axios from "axios";

export default {
  setup() {
    const messages = ref("");
    const messageTime = ref("");
    var messageCheck = ref(false);
    return {
      messages,
      messageTime,
      messageCheck,
    };
  },
  async mounted() {
    await axios.get(import.meta.env.VITE_API_ENDPOINT + "/auth", { withCredentials: true }).then((resp) => {
      const auth_lvl = resp.data.auth_lvl;
      console.log(resp);
      if (!(auth_lvl == 1 || auth_lvl == 2 || auth_lvl == 3)) {
        location.href = "/";
      }
    });
    await axios.get(import.meta.env.VITE_API_ENDPOINT + "/messages", {withCredentials: true}).then((resp) => {
      const data = resp.data;
      if (data.msg.length > 0) {
        this.messages.value = data.msg;
        this.messageTime.value = new Date(data.timestamp).toLocaleString();
        this.messageCheck.value = true;
      }
    })
  },
  methods: {
    hideMessage() {
      this.messageCheck = false;
    }

  }
};

</script>

<template>
  <div class="messageDisplay" v-if="messageCheck">
    <p class="time">{{ messageTime }} :</p>
    <p class="body">{{ messages }}</p>
    <button @click="hideMessage()"><b>x</b></button>
  </div>
  <div v-else></div>
</template>

<style>
.messageDisplay {
  width: 100%;
  background-color: #00bbbb;
  color: white;
  display: flex;
  flex-direction: row;
  padding: 1rem;
  font-weight: bold;
}

@media print {
  .messageDisplay {
    display: none !important;
  }
}

.time {
  margin-right: 0.25rem;
}

.body {
  flex-grow: 10;
  text-align: left;
}
</style>
