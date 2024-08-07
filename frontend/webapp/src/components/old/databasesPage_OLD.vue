<template>
    <div class="card text-center m-3">
        <div class="card-body">
            <notification />
            <ood_notify v-if="ood" />
            <h1 class="header">Internal Databases</h1>
            <div id="database-bar">
                <input type="text" v-model="databaseSearchKeyword" placeholder="Search Databases" />
            </div>

            <table class="styled-table">
                <thead>
                    <tr>
                        <!-- Add click events and icons for sorting -->
                        <th class="dName" @click="sortBy('name')">
                            Name {{ getSortingIcon("name") }}
                        </th>
                        <th class="dSize" @click="sortBy('size')" :key="update">
                            Size in GB {{ getSortingIcon("size") }}
                        </th>
                        <th class="dPath" @click="sortBy('paths')">
                            Path {{ getSortingIcon("paths") }}
                        </th>
                        <th class="dCreated" @click="sortBy('created')">
                            Created {{ getSortingIcon("created") }}
                        </th>
                        <th class="dVersion" @click="sortBy('version')">
                            Version {{ getSortingIcon("version") }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="database in filteredDatabases" :key="database.name">
                        <td>{{ database.name }}</td>
                        <td>{{ database.size }}</td>
                        <td class="pathWrap">
                            <span v-for="path in database.paths" :key="path">{{ path }}</span>
                        </td>
                        <td>{{ database.created }}</td>
                        <td>{{ database.version == 'null' ? '' : database.version }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import notification from "./notification.vue";
import ood_notify from './ood_notify.vue';
import router from "../router/index.js";
const databaseSearchKeyword = ref("");
var databases = ref(null);
var ood = false;

var update = ref(0);

let auth_lvl = 0;

const calculateCost = (sizeInGB) => {
    return (sizeInGB * 0.13).toFixed(2); // Multiply size by 0.13 and round to 2 decimal places
};

onMounted(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "/databases", {
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            databases.value = data.data;
            ood = data.ood;
        })
        .then(() => {
            sortBy("size");
            update.value += 1;
        })
        .catch((error) => {
            console.error("Error fetching database data:", error);
        });
});

const filteredDatabases = computed(() => {
    if (!databaseSearchKeyword.value) {
        return databases.value;
    }
    const keywordTwo = databaseSearchKeyword.value.toLowerCase();
    return databases.value.filter((database) =>
        (database.name + database.paths.join("") + calculateCost(database.size))
            .toLowerCase()
            .includes(keywordTwo)
    );
});

const SortingOrder = {
    Ascending: 0,
    Descending: 1,
};

let sorting = {
    sorting_col: "size",
    sorting_order: SortingOrder.Ascending,
};

function sortBy(col) {
    if (sorting.sorting_col == col) {
        sorting.sorting_order =
            sorting.sorting_order == SortingOrder.Ascending
                ? SortingOrder.Descending
                : SortingOrder.Ascending;
    } else {
        sorting.sorting_col = col;
        sorting.sorting_order = SortingOrder.Ascending;
    }

    databases.value.sort((a, b) => {
        let val1 = a[sorting.sorting_col];
        let val2 = b[sorting.sorting_col];
        if (val1 == null || val1 == undefined)
            return sorting.sorting_order == SortingOrder.Ascending ? -1 : 1;
        if (val2 == null || val2 == undefined)
            return sorting.sorting_order == SortingOrder.Ascending ? 1 : -1;
        if (sorting.sorting_col === "paths") {
            return sorting.sorting_order == SortingOrder.Ascending
                ? val1[0].localeCompare(val2[0])
                : val2[0].localeCompare(val1[0]);
        } else if (sorting.sorting_col === "created") {
            let d1 = new Date(val1).getSeconds();
            let d2 = new Date(val2).getSeconds();
            return sorting.sorting_order == SortingOrder.Ascending ? (d1 < d2 ? 1 : -1) : (d2 < d1 ? 1 : -1);
        }
        if (typeof val1 === "string" && typeof val2 === "string")
            return sorting.sorting_order == SortingOrder.Ascending
                ? val1.localeCompare(val2)
                : val2.localeCompare(val1);
        else
            return sorting.sorting_order == SortingOrder.Ascending
                ? val1 - val2
                : val2 - val1;
    });
}

const getSortingIcon = (column) => {
    // Return appropriate icon based on the sorting order
    if (sorting.sorting_col == column) {
        if (sorting.sorting_order === SortingOrder.Ascending) {
            return "\u25B2"; // Upward-pointing triangle
        } else {
            return "\u25BC"; // Downward-pointing triangle
        }
    } else {
        return "";
    }
};
</script>

<style scoped>
.card {
    padding: 1rem;
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

.pathWrap {
    display: flex;
    flex-direction: column;
    max-width: 48rem;
    word-break: break-all;
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

.dVersion:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.dCreated:hover {
    background-color: #af2525;
    scale: 105%;
    transition: ease 0.5s;
}

.dCost1:hover {
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
