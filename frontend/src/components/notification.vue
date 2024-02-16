<script>
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const messages = ref("Hello, Vue!");
    const messageTime = ref("");
    var messageCheck = ref(false);

    onMounted(async () => {
      let resp = await fetch('https://itassets.aiscorp.com:3000/messages', {
        headers: {
          auth: '6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t'
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        console.log(data)
        messages.value = data.message;
        // Thu Jul 27 2023 09:57:48
        messageTime.value = new Date(data.timestamp).toLocaleString();
        messageCheck.value = messages.value.length > 0;
      } else {
        console.error('Error fetching data:', error);
      }
    });
    return {
      messages,
      messageTime,
      messageCheck,
    };
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
}</style>
