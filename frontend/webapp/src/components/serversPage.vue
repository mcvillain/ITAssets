<template>
    <div class="card text-center m-3">
        <div class="card-body">
            <notification />
            <v-data-table class="rounded-xl" v-model:sort-by="sortBy" :headers="headers" :items="databases" v-model:items-per-page="itemsPerPage"
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
                <template v-slot:item.Status="{ item }">
                    <v-chip :color="item.Status=='Running'?'green':'red'" :text="item.Status" class="text-uppercase" style="margin-left: 1rem; margin-right: 1rem;" size="small" label></v-chip>
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
    { title: "VM Name", value: "VMName", sortable: true, filterable: true },
    { title: "Status", value: "Status", sortable: true, filterable: true },
    { title: "IP", value: "IP", sortable: true, filterable: true },
    { title: "Last Check-In", value: "LastCheckInTime", sortable: true, filterable: false },
    { title: "Hypervisor", value: "HyperVisor", sortable: true, filterable: true },
    { title: "Hostname", value: "Hostname", sortable: true, filterable: true },
    { title: "Cost", value: "Cost", sortable: true, filterable: false },
];
const sortBy = ref([{ key: 'size', order: 'desc' }]);

onMounted(() => {
    fetch(import.meta.env.VITE_API_ENDPOINT + "/servers", {
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
