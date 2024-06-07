<template>
  <notification />
  <h2 class=heading>Total Accounts</h2>
  <div class="userNumbers" :key="update">
    <p><span class="b">Total Users: </span>{{ data.totalUsers }}</p>
    <p><span class="b">Service Accounts: </span>{{ data.serviceAccounts }}</p>
  </div>
  <div class="divider2"></div>
  <h2 class=heading>Users by Department</h2>
  <div class="chart-container">
    <div class="doughnut-container">
      <div class="doughnut">
        <doughnut :userdata="data" :key="update" />
      </div>
    </div>
    <div class="divider"></div>
    <div class="bargraphs">
      <div class="bg upm">
        <b class=heading>Users per Manager</b>
        <perManager :userdata="data" :key="update" />
      </div>
      <div class="bg upjt">
        <b class=heading>Users per Job Title</b>
        <jobTitles :userdata="data" :key="update" />
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
import router from './router/index.js';

const update = ref(0);

const forceRerender = () => {
  update.value += 1;
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

let auth_lvl = 0;
onMounted(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "/auth", {
        credentials: "include",
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.auth_lvl <= 0) {
              router.push('/');
            }
            auth_lvl = resp.auth_lvl;
        })
        .then(() => fetch(import.meta.env.VITE_API_ENDPOINT + "/users", {
            credentials: "include",
        }))
        .then((response) => response.json())
        .then((respData: UsersResponse) => {
          data = respData;
          forceRerender();
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });;
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