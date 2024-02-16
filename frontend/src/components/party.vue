<template>
<div>
  <notification/>
  <!--<audio id="play">
    <source src="./src/assets/TrezzaVienna.mp3" type="audio/mpeg">
  </audio>-->
  <img id="spin" src="/src/assets/parent.webp">
</div>  
  <div class="card text-center m-3">
    <div class="card-body">
      <h1 class="header" v-if="toggleDataTable.value == 'about'"></h1>
      <h1 class="header" v-else-if="toggleDataTable.value =='database'"></h1>
      <h1 class="header" v-else></h1>
      <div class="search-bar" v-if="toggleDataTable.value != 'about'">
        <input type="text" v-model="searchKeyword" placeholder="Search Name" />
      </div>
      <div v-if="toggleDataTable.value == 'about'">
        <aboutPage></aboutPage>
        <!--ABOUT PAGE CAN BE BUILT HERE
            OR DESIGNED IN ANOTHER COMPONENT AND IMPORTED-->
      </div>

      <table v-else-if="toggleDataTable.value == 'database'" class="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size in GB</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="database in filteredDatabases" :key="database.name">
            <td>{{ database.name }}</td>
            <td>{{ database.size }}</td>
            <td>{{ database.paths }}</td>
          </tr>
        </tbody>
      </table>  

      <table v-else="toggleDataTable" class="styled-table">
        <thead>
          <tr>
            <th class="vm">VM Name</th>
            <th class="stat">Status</th>
            <th class="ip">IP</th>
            <th class="time">Last Check-In Time</th>
            <th class="hv">HyperVisor</th>
            <th class="host">Hostname</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="server in filteredServers" :key="server.VMName">
            <td>{{ server.VMName }}</td>
            <td>
              <div class="running" v-if="server.Status=='Running'"></div>
              <div class="offline" v-else></div>
            </td>
            <td>{{ server.IP }}</td>
            <td>{{ server.LastCheckInTime }}</td>
            <td>{{ server.HyperVisor }}</td>
            <td>{{ server.Hostname }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import toggleDataTable from './state.js';
import aboutPage from "./aboutPage.vue";
import notification from './notification.vue';
import router from './router/index.js';
const searchKeyword = ref('');
var servers = ref(null);
var databases = ref(null);
console.log(toggleDataTable.value);

//localStorages
const ong = localStorage.getItem('brotha');
const token = localStorage.getItem('jwt');
const auth = localStorage.getItem('header');

if(ong == 'lnzJe2rnW3fssC2aGuOhkBWmukFGezDlk9yZaLtE0kdC5PZXp20EwVLU9UWibIiSFgNJfvZi8DO7pTghhHHTHkWdbyCvngkmXiY5ZXbsjl0XxnPGlwkVkgVo7kCgbknRN991FMdjeY6SeSf6ImylDy0DXIyfkKYclpvmWrCr2aiYaT0w6pVZAvxj1IDHKnuSMmUOQ4jHdE5qMKpvfepe5o2VDYDixXGMAYGpvNc7TdKyUUK7y3n0qiJ2AE8IGD5RdYKd2W0cpuOHwAeBZ44j1E75joAXoGl8UCaMGzLiZtMgcVvDlbCmLKfZnJEDc5tVTj0waoqYxTzzbXwCSo8QZLH2Aevt2rj' && auth == 'Bearer ' + token){
  console.log('hello');
  onMounted(() => {
    fetch('https://itassets.aiscorp.com:3000/servers', {
      headers: {
        auth: '6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t'
      },
    })
      .then(response => response.json())
      .then(data => {
        servers.value = data;
      })
      .catch(error => {
        console.error('Error fetching server data:', error);
      });

    fetch('https://itassets.aiscorp.com:3000/databases', {
      headers: {
        auth: '6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t'
      },
    })
      .then(response => response.json())
      .then(data => {
        databases.value = data;
      })
      .catch(error => {
        console.error('Error fetching database data:', error);
      });
  });
} else {
  router.push('/')
}
const filteredServers = computed(() => {
  if (!searchKeyword.value) {
    return servers.value;
  }
  return servers.value.filter(server => server.VMName.toLowerCase().includes(searchKeyword.value.toLowerCase()));
});


const filteredDatabases = computed(() => {
  if (!searchKeyword.value) {
    return databases.value;
  }
  const keywordTwo = searchKeyword.value.toLowerCase();
  return databases.value.filter(databases => databases.name.toLowerCase().includes(keywordTwo));
});



</script>

<style>
#spin:hover {
  animation: spin 1s linear infinite;

}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    margin-left: auto;
    margin-right: auto;

}

.running {
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: lime;
  /*border: 1px solid black;*/
  margin: auto;
}

.offline {
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: red;
  /*border: 1px solid black;*/
  margin: auto;
}

.search-bar {
  border: 1px solid rgb(206, 206, 206);
  background-color: #f3f5ff;
  width: 195px;
  margin-left: 10px;
  margin-left: auto;
  margin-right: auto;
}

input[type="text"] {
  text-align: center;
}

.vm:hover {
background-color: #3a25af;
  scale: 105%;
  transition: ease 0.5s;
}

.stat:hover{
  background-color: #3a25af;
  scale: 105%;
  transition: ease 0.5s;
}

.ip:hover{
  background-color: #3a25af;
  scale: 105%;
  transition: ease 0.5s;
}

.time:hover{
  background-color: #3a25af;
  scale: 105%;
  transition: ease 0.5s;
}

.hv:hover{
  background-color: #3a25af;
  scale: 105%;
  transition: ease 0.5s;
}

.host:hover{
  background-color: #3a25af;
  scale: 105%;
  transition: ease 0.5s;
}

.styled-table thead tr {
    background-color: #2e50e9;
    color: #ffffff;
    text-align: left;
}

.styled-table tbody tr:nth-of-type(even):focus {
    background-color: #f3f3f3;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr:nth-of-type(red) {
    background-color: #eb9696;
}

.styled-table tbody tr {
    background-color:#e0e0e0;
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    background-color: #ffffff;
    border-bottom: 2px solid #2e50e9;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}


h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}


  .gannon:hover { 
    max-width: fit-content;
    max-height: fit-content;
  }
  
  body {
    background-color:rgb(255, 255, 255);
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  body {
    height: 100vh;
     background: linear-gradient(90deg,#2e5fe5,#a200ff);
  
  }
  
  .slider-thumb::before {
    position: absolute;
    content: "";
    left: 30%;
    top: 20%;
    width: 450px;
    height: 450px;
    background: #e2e2e2;
    border-radius: 62% 47% 82% 35% / 70% 45% 80% 66%;
    will-change: border-radius, transform, opacity;
    animation: sliderShape 5s linear infinite;
    display: block;
    z-index: -1;
    -webkit-animation: sliderShape 5s linear infinite;
  }
  @keyframes sliderShape{
    0%,100%{
    border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
      transform: translate3d(0,0,0) rotateZ(0.01deg);
    }
    34%{
        border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%;
      transform:  translate3d(0,5px,0) rotateZ(0.01deg);
    }
    50%{
      transform: translate3d(0,0,0) rotateZ(0.01deg);
    }
    67%{
      border-radius: 100% 60% 60% 100% / 100% 100% 60% 60% ;
      transform: translate3d(0,-3px,0) rotateZ(0.01deg);
    }
  }
  
  </style>