<template>
    <div class="card text-center m-3">
        <div class="card-body">
            <notification />
            <v-data-table class="rounded-xl" v-model:sort-by="sortBy" v-model:expanded="expanded"
                show-expand :headers="headers" :items="databases" v-model:items-per-page="itemsPerPage"
                item-value="name" item-key="name" :search="search" :loading="loading">
                <template v-slot:top>
                    <v-toolbar class="rounded-t-xl">
                        <ood_notify_vuetify v-if="ood" />
                        <v-toolbar-title>Azure Databases</v-toolbar-title>
                    </v-toolbar>
                    <v-toolbar>
                        <v-text-field class="w-75 mw-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify"
                            hide-details clearable single-line variant="solo-filled" v-model="search"></v-text-field>
                    </v-toolbar>
                </template>
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>
                <template v-slot:expanded-row="{ columns, item }">
                    <tr>
                        <td style="text-align: left;" :colspan="columns.length">
                            <p style="font-weight: bold;font-size: 1.25rem;">Paths:</p>
                            <ul style="margin-bottom: 0.25rem;">
                                <li v-for="path in item.paths">{{ path }}</li>
                            </ul>
                        </td>
                    </tr>
                </template>
                <template v-slot:item.paths="{ item }"></template>
                <template v-slot:item.cost="{ item }">
                    ${{ item.cost.toFixed(2) }}/month
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import notification from './notification.vue';
import ood_notify_vuetify from './ood_notify_vuetify.vue';
var databases = ref(null);
var ood = false;
var loading = ref(true);
var itemsPerPage = ref(10);
var search = ref("");

const headers = [
    { title: "Name", value: "name", sortable: true, filterable: true },
    { title: "Size", value: "size", sortable: true, filterable: false },
    { title: "", value: "paths", sortable: false, filterable: true },
    { title: "Created", value: "created", sortable: true, filterable: true },
    { title: "Version", value: "version", sortable: true, filterable: true },
    { title: "Cost", value: "cost", sortable: true, filterable: false },
];
const sortBy = ref([{ key: 'size', order: 'desc' }]);
const expanded = ref([]);

onMounted(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "/azure_dbs", {
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data) => {
            databases.value = data.data;
            ood = data.ood;
            loading.value = false;
        })
        .catch((error) => {
            console.error("Error fetching database data:", error);
        });
});
</script>

<style scoped>
.header {
    margin-bottom: 2rem;
}

.card {
    padding: 1rem;
}

.mw-75 {
    max-width: 75%;
}

.search-bar {
    margin-left: auto;
    margin-right: auto;
}

ul {
    padding-left: 1rem;
}
</style>
