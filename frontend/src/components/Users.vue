<template>
  <notification />
  <h2 class=heading>Total Accounts</h2>
  <div class="userNumbers" :key="uns">
    <p><span class="b">Total Users: </span>{{ data.totalUsers }}</p>
    <p><span class="b">Service Accounts: </span>{{ data.serviceAccounts }}</p>
  </div>
  <div class="divider2"></div>
  <h2 class=heading>Users by Department</h2>
  <div class="chart-container">
    <div class="doughnut-container">
      <div class="doughnut">
        <doughnut :userdata="data" :key="dnt" />
      </div>
    </div>
    <div class="divider"></div>
    <div class="bargraphs">
      <div class="bg upm">
        <b class=heading>Users per Manager</b>
        <perManager :userdata="data" :key="upm" />
      </div>
      <div class="bg upjt">
        <b class=heading>Users per Job Title</b>
        <jobTitles :userdata="data" :key="upjt" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import notification from './notification.vue';
import doughnut from './doughnut.vue';
import perManager from './perManager.vue';
import jobTitles from './jobTitles.vue';
import { onMounted, ref } from 'vue';

const uns = ref(0);
const dnt = ref(0);
const upm = ref(0);
const upjt = ref(0);

const forceRerender = () => {
  uns.value += 1;
  dnt.value += 1;
  upm.value += 1;
  upjt.value += 1;
};

type UsersResponse = {
  departments: {
    key: string,
    value: number,
  } | null,
  totalUsers: number | null,
  serviceAccounts: number | null,
  title: {
    key: string,
    value: number,
  } | null,
  manager: {
    key: string,
    value: number,
  } | null,
}

let data: UsersResponse = {
  departments: null,
  totalUsers: null,
  serviceAccounts: null,
  title: null,
  manager: null
};

onMounted(async () => {
  // Fetch data from the server
  let resp = await fetch('https://itassets.aiscorp.com:3000/users', {
    headers: {
      auth: '6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t'
    },
  });

  if (resp.ok) {
    data = (await resp.json() as UsersResponse);
    forceRerender();
  } else {
    console.error('Error fetching data:');
  }
});
</script>
<style scoped>
.heading {
  font-size: xx-large;
}

.chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
}

.bg {
  width: 45%;
}

.b {
  font-weight: bold;
}

.divider {
  height: 5rem;
  width: 100%;
}

.divider2 {
  height: 2.5rem;
  width: 100%;
}

.doughnut-container {
  width: 100%;
}

.doughnut {
  max-width: 525px;
  display: flex;
  margin: auto;
}

.bargraphs {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>