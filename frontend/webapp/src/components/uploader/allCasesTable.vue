<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="search" item-value="name" @update:options="loadItems"
        class="centered-table">
        <template v-slot:top>
            <v-toolbar class="rounded-t-xl">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <!-- TABLE HEADER -->
            <v-toolbar>
                <div class="tb-row">
                    <v-text-field class="w-75 mw-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify"
                        hide-details clearable single-line variant="solo-filled" v-model="search"></v-text-field>
                    <!-- <v-btn icon="mdi-table-arrow-down" size="large" href="/api/LocalDatabases.csv"
                            download></v-btn> -->
                </div>
            </v-toolbar>
        </template>
        <!-- CASE FILES MODAL -->
        <template v-slot:item.case_id="{ value }">
            <CaseFilesModal :case_id="value" />
        </template>
        <!-- Show Size in GB -->
        <template v-slot:item.case_size="{ value }">
            {{ (value as number)>0?bytesToHumanReadable(value as number):'0' }}
        </template>
        <!-- ITAR Column -->
        <template v-slot:item.itar="{ value }">
            <v-chip v-if="value == 1" color="red" text="ITAR" class="text-uppercase"
                style="margin-left: 1rem; margin-right: 1rem;" size="small" label></v-chip>
        </template>
        <!-- Creation Date Column -->
        <template v-slot:item.created_at="{ value }">
            {{ new Date(value).toLocaleString() }}
        </template>
    </v-data-table-server>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CaseFilesModal from './caseFilesModal.vue';

const props = defineProps({
    endpoint: String,
    title: String,
});

const itemsPerPage = ref(5);
const headers = [
    { title: "Case ID", sortable: true, key: 'case_id' },
    { title: "Case Owner", sortable: true, key: 'owner' },
    { title: "Creation Date", sortable: true, key: 'created_at' },
    { title: "Case Size", sortable: true, key: 'case_size' },
    { title: "ITAR", sortable: true, key: 'itar' },
];
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

function loadItems(options: any) {
    loading.value = true;
    fetch(`${import.meta.env.VITE_API_ENDPOINT}${props.endpoint}`, {
        body: JSON.stringify(options),
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async resp => {
        if (!resp.ok) {
            console.error("Could not load cases...");
            console.error(`${resp.status}: ${resp.statusText}`);
        }
        let body = await resp.json();
        serverItems.value = body.items;
        totalItems.value = body.total;
        loading.value = false;
    }).catch(err => console.error(err));
}

function bytesToHumanReadable(bytes: number): string {
    if (bytes >= Math.pow(10, 9)) {
        const gigabytes = bytes / Math.pow(10, 9);
        return gigabytes.toFixed(2) + " GB";
    } else if (bytes >= Math.pow(10, 6)) {
        const megabytes = bytes / Math.pow(10, 6);
        return megabytes.toFixed(2) + " MB";
    } else if (bytes >= Math.pow(10, 3)) {
        const kilobytes = bytes / Math.pow(10, 3);
        return kilobytes.toFixed(2) + " KB";
    } else {
        return bytes + " B";
    }
}
</script>

<style scoped>
.mw-75 {
    max-width: 75%;
}

.tb-row {
    width: 100%;
    display: flex;
    justify-content: center;
}

.centered-table .v-data-table-header th {
    text-align: center;
}
</style>