<template>
    <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" :search="search" item-value="name"
        @update:options="loadItems"></v-data-table-server>

</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';

const itemsPerPage = ref(5);
const headers = [
    { title: "Case ID", sortable: true, key: 'case_id' },
    { title: "Case Owner", sortable: true, key: 'owner' },
    { title: "Creation Date", sortable: true, key: 'created_at' },
];
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

function loadItems(options: any) {
    loading.value = true;
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/uploads/get_all_cases`, {
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
</script>

<style scoped></style>










<!--


    <v-data-table class="rounded-xl mw-75 elevation-1" v-model:sort-by="sortBy" :headers="headers" :items="example"
        v-model:items-per-page="itemsPerPage" item-value="name" item-key="name" :search="search" :loading="loading"
        :item-class="row - item">
        <template v-slot:top>
            <v-toolbar class="rounded-t-xl">
                <v-toolbar-title>All Cases</v-toolbar-title>
            </v-toolbar>
            <v-toolbar>
                <v-text-field class="w-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify" hide-details
                    clearable single-line variant="solo-filled" v-model="search"></v-text-field>
            </v-toolbar>
        </template>
        <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
        <template v-slot:item.caseID="{ item }">
            <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn block variant="flat" v-bind="activatorProps">
                        {{ item.caseID }}
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        More Info
                    </v-card-title>
                    <v-card-text>
                        Random Case information
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="close">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <template v-slot:item.delete="{ item }">
            <v-dialog max-width="400" v-model="dialogDelete">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn id="modal" height="57" width="125" rounded="0" v-bind="activatorProps"
                        class="bg-#b71c1c bi bi-trash-fill" block variant="flat" @click="deleteItem(item)"></v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                    <v-card title="Delete?">
                        <v-card-text>
                            Are you sure you want to delete these item(s)?
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text="No" @click="closeDelete"></v-btn>
                            <v-btn text="Yes" @click="deleteItemConfirm"></v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </template>
    </v-data-table>
-->