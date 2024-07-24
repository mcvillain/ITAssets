<template>
    <notification />
    <h2 style="align-content: center; margin-top: 2rem; margin-bottom: 1rem; font-size: xx-large;">Case ID Uploader</h2>

    <div style="margin: 3rem;"></div>

    <v-text-field clearable label="CaseID" variant="solo" width="78%" class="mx-auto" rounded="lg"
        placeholder="Ex: 12345"></v-text-field>
    <v-btn @click="" rounded="lg">
        Get Upload URL
    </v-btn>

    <div style="margin: 1rem;"></div>

    <div style="display: flex; flex-direction: row; justify-content: center; width: 100%;">
        <v-text-field clearable label="Upload URL" id="url" style="max-width: 75%; margin: 0"
            rounded="ts-lg bs-lg te-0 be-0" variant="solo" v-model="upload_url"></v-text-field>
        <v-btn icon="mdi-content-copy" size="large" @click="copyMyText()" rounded="te-lg be-lg ts-0 bs-0 "
            variant="flat solo"></v-btn>
    </div>

    <div style="margin: 3rem;">

        <div class="card m-3">
            <div class="card-body">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <v-data-table class="rounded-xl mw-75 elevation-1" v-model:sort-by="sortBy" :headers="headers"
                        :items="example" v-model:items-per-page="itemsPerPage" item-value="name" item-key="name"
                        :search="search" :loading="loading">
                        <template v-slot:top>
                            <v-toolbar class="rounded-t-xl " id="head">
                                <v-toolbar-title>My Cases</v-toolbar-title>
                            </v-toolbar>
                            <v-toolbar>
                                <v-text-field class="w-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify"
                                    hide-details clearable single-line variant="solo-filled" rounded="0"
                                    v-model="search"></v-text-field>

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
                                    <v-card-title>
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
                            <div>
                                <v-dialog max-width="400" v-model="dialogDelete">
                                    <template v-slot:activator="{ props: activatorProps }">
                                        <v-btn id="modal" height="57" width="100" rounded="0" v-bind="activatorProps"
                                            class="bg-#b71c1c bi bi-trash-fill" block variant="flat"
                                            @click="deleteItem(item)"></v-btn>
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
                            </div>
                        </template>
                    </v-data-table>

                    <div style="margin: 4rem;"></div>

                    <v-data-table class="rounded-xl mw-75 elevation-1" v-model:sort-by="sortBy" :headers="headers"
                        :items="example" v-model:items-per-page="itemsPerPage" item-value="name" item-key="name"
                        :search="search" :loading="loading" :item-class="row - item">
                        <template v-slot:top>
                            <v-toolbar class="rounded-t-xl">
                                <v-toolbar-title>All Cases</v-toolbar-title>
                            </v-toolbar>
                            <v-toolbar>
                                <v-text-field class="w-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify"
                                    hide-details clearable single-line variant="solo-filled"
                                    v-model="search"></v-text-field>
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
                                        class="bg-#b71c1c bi bi-trash-fill" block variant="flat"
                                        @click="deleteItem(item)"></v-btn>
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

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import notification from './notification.vue';
// import mainTable from './uploader/mainTable.vue';
import { ref, Ref } from 'vue'
import { createVuetify } from 'vuetify'

// var databases = ref(null);
var loading = ref(true);
var itemsPerPage = ref(10);
var search = ref("");
const upload_url = ref("whatever");

const sortBy = ref([{ key: 'size', order: 'desc' }]);
// const expanded = ref([]);

loading.value = false;

async function copyMyText() {
    // let urlbox = document.getElementById("url");
    // urlbox.select();
    await navigator.clipboard.writeText(upload_url.value);
}

// onMounted(() => {
//     fetch(import.meta.env.VITE_API_ENDPOINT + "/uploader", {
//         credentials: "include",
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             databases.value = data.data;
//             ood = data.ood;
//             loading.value = false;
//         })
//         .catch((error) => {
//             console.error("Error fetching data:", error);
//         });
// });


</script>

<script>
export default {
    data: () => ({

        dialog: false,
        dialogDelete: false,

        headers: [
            { title: "CaseID", key: "caseID", align: "center", sortable: true, filterable: true },
            { title: "Guid", key: "guid", align: "center", sortable: true, filterable: true },
            { title: "", key: "delete", align: "end" },
        ],

        example: [
            { caseID: 12345, guid: 'HERIEOEHEOEH' },
            { caseID: 678910, guid: 'HEEPIROEIEI' },
            { caseID: 231321, guid: 'HERERWHEIEER' },
            { caseID: 768263, guid: 'HEYUIEIRUIER' },
        ],

        editedIndex: -1,
        editedItem: {
            caseID: '',
            guid: '',
        },

        defaultItem: {
            caseID: '',
            guid: '',
        },
    }),

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    methods: {

        deleteItem(item) {
            this.editedIndex = this.example.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.example.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

    }
}

</script>

<style scoped>
#modal {
    /* margin-left: .5rem;
    margin-right: .5rem; */
    font-size: x-large;
    color: crimson;
}

.mw-75 {
    max-width: 80%;
}
</style>