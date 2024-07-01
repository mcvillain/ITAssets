<template>
    <div class="card text-center m-3">
        <div class="card-body">
            <notification />
            <ood_notify v-if="ood" />
            <h1 class="header">Servers</h1>
            <div id="server-bar">
                <input type="text" v-model="serverSearchKeyword" placeholder="Search Servers" />
            </div>


            <table class="styled-table">
                <thead>
                    <tr>
                        <!-- Add click events and icons for sorting -->
                        <th class="vm" @click="sortBy('VMName')">VM Name {{ getSortingIcon('VMName') }}</th>
                        <th class="stat status_row_cell" @click="sortBy('Status')">Status {{ getSortingIcon('Status')
                            }}</th>
                        <th class="ip" @click="sortBy('IP')">IP {{ getSortingIcon('IP') }}</th>
                        <th class="time" @click="sortBy('LastCheckInTime')">Last Check-In Time {{
                            getSortingIcon('LastCheckInTime') }}</th>
                        <th class="hv" @click="sortBy('HyperVisor')">HyperVisor {{ getSortingIcon('HyperVisor') }}</th>
                        <th class="host" @click="sortBy('Hostname')">Hostname {{ getSortingIcon('Hostname') }}</th>
                        <th class="Cost" @click="sortBy('Cost')">Cost {{ getSortingIcon('Cost') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="server in filteredServers" :key="server.VMName">
                        <td>{{ server.VMName }}</td>
                        <td class="status_row_cell">
                            <div class="status_row" v-if="server.Status === 'Running'">
                                <div class="running"></div>
                                <div class="status_text">{{ server.Status }}</div>
                            </div>
                            <div class="status_row" v-else>
                                <div class="offline"></div>
                                <div class="status_text">{{ server.Status }}</div>
                            </div>
                        </td>
                        <td>{{ server.IP }}</td>
                        <td>{{ dateToString(server.LastCheckInTime) }}</td>
                        <td>{{ server.HyperVisor }}</td>
                        <td>{{ server.Hostname }}</td>
                        <td>{{ server.Cost }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import notification from './notification.vue';
import ood_notify from './ood_notify.vue';
import router from './router/index.js';
const serverSearchKeyword = ref('');
var servers = ref(null);
var ood = false;

function dateToString(old_date) {
    let date = new Date(old_date);
    return `${(date.getHours() % 12 == 0 ? 12 : date.getHours() % 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ${date.getHours() >= 12 ? "PM" : "AM"} ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

onMounted(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + '/servers', {
        credentials: "include",
    })
        .then(response => response.json())
        .then(data => {
            servers.value = data.data;
            ood = data.ood;
        })
        .then(() => {
            sortBy("VMName");
        })
        .catch(error => {
            console.error('Error fetching server data:', error);
        });
});

const filteredServers = computed(() => {
    if (!serverSearchKeyword.value) {
        return servers.value;
    }
    return servers.value.filter(server => (server.VMName + server.Status + server.IP + server.HyperVisor + server.Hostname).toLowerCase().includes(serverSearchKeyword.value.toLowerCase()));
});


const SortingOrder = {
    Ascending: 0,
    Descending: 1
}

let sorting = {
    sorting_col: '',
    sorting_order: SortingOrder.Ascending
}

function sortBy(col) {
    if (sorting.sorting_col == col) {
        sorting.sorting_order = sorting.sorting_order == SortingOrder.Ascending ? SortingOrder.Descending : SortingOrder.Ascending;
    } else {
        sorting.sorting_col = col;
        sorting.sorting_order = SortingOrder.Ascending;
    }

    servers.value.sort((a, b) => {
        let val1 = a[sorting.sorting_col];
        let val2 = b[sorting.sorting_col];
        if (val1 == null || val1 == undefined) return (sorting.sorting_order == SortingOrder.Ascending) ? -1 : 1;
        if (val2 == null || val2 == undefined) return (sorting.sorting_order == SortingOrder.Ascending) ? 1 : -1;
        if (sorting.sorting_col == "IP") {
            const ip1 = val1.split('.').map(Number);
            const ip2 = val2.split('.').map(Number);
            for (let i = 0; i < 4; i++) {
                if (ip1[i] < ip2[i])
                    return (sorting.sorting_order == SortingOrder.Ascending) ? -1 : 1;
                else
                    return (sorting.sorting_order == SortingOrder.Ascending) ? 1 : -1;
            }
        }
        if (typeof val1 === 'string' && typeof val2 === 'string')
            return sorting.sorting_order == SortingOrder.Ascending ? val1.localeCompare(val2) : val2.localeCompare(val1);
        else
            return sorting.sorting_order == SortingOrder.Ascending ? val1 - val2 : val2 - val1;
    });
}

const getSortingIcon = (column) => {
    // Return appropriate icon based on the sorting order
    if (sorting.sorting_col == column) {
        if (sorting.sorting_order === SortingOrder.Ascending) {
            return '\u25B2'; // Upward-pointing triangle
        } else {
            return '\u25BC'; // Downward-pointing triangle
        }
    } else {
        return '';
    }
};
</script>

<style scoped>
.running {
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: lime;
}

.offline {
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: red;
}

.status_row_cell {
    min-width: 0 !important;
}

.status_row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.status_text {
    padding-left: 1rem;
}

#server-bar {
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

#database-bar {
    border: 1px solid rgb(206, 206, 206);
    background-color: #f3f5ff;
    width: 195px;
    margin-left: 10px;
    margin-left: auto;
    margin-right: auto;
}

.vm:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.stat:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.ip:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.time:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.hv:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.host:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.Cost:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.dName:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.dSize:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.dPath:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    max-width: 1200px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    margin-left: auto;
    margin-right: auto;

}

.styled-table thead tr {
    background-color: #e92e2e;
    color: #ffffff;
    text-align: center;
}

.styled-table tbody tr:nth-of-type(even):focus {
    background-color: #f3f3f3;
}

.styled-table tbody tr:hover {
    background-color: #9c9c9c;
}

.styled-table tbody tr:nth-of-type(even):hover {
    background-color: #9c9c9c;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
    min-width: 200px;
}

.styled-table tbody tr:nth-of-type(red) {
    background-color: #eb9696;
}

.styled-table tbody tr {
    background-color: #e0e0e0;
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    background-color: #ffffff;
    border-bottom: 2px solid #e92e2e;
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
</style>