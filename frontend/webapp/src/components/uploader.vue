<template>
    <notification />
    <!-- <div class="" style=" justify-content: center; align-content: center; ;">
        <h2 style="align-content: center; margin-top: 2rem; margin-bottom: 1rem; font-size: xx-large;">Case ID Uploader
        </h2>
        <div class="my-2">
            <input id="caseID" name="caseID" type="text" placeholder="Case ID:"
                style="background-color: white; border: 1px black solid; border-radius: 1rem; padding:.25rem; text-align: center;" />
        </div>
        <div>
            <button class="postBtn" id="postBtn" @click="postCaseID()">Jared Button</button>
        </div>
        <div>
            <input id="url" type="text" placeholder="URL To Be Posted Here:"
                style="background-color: white; border: 1px black solid;  padding:.25rem; text-align: center; margin: 1rem; border-radius: 1rem;" />
        </div>
        <div>
            <button @click="copyMyText()" class="postBtn">Copy To Clipboard</button>
         </div>
    <div class="spacer">
        </div>
        <mainTable table_data_endpoint="uploader/current_user_cases" />
        <div class="spacer"></div> -->

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
            variant="flat"></v-btn>
    </div>

    <div style="margin: 3rem;">

        <div class="card text-center m-3">
            <div class="card-body">
                <v-data-table class="rounded-xl" v-model:sort-by="sortBy" :headers="headers"
                    :items="example" v-model:items-per-page="itemsPerPage" item-value="name" item-key="name"
                    :search="search" :loading="loading" show-select v-model="selected">
                    <template v-slot:top>
                        <v-toolbar class="rounded-t-xl">
                            <ood_notify_vuetify v-if="ood" />
                            <v-toolbar-title>My Cases</v-toolbar-title>
                        </v-toolbar>
                        <v-toolbar>
                            <v-dialog max-width="400">
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn id="modal" height="55" width="100" v-bind="activatorProps"
                                        class="bg-#b71c1c bi bi-trash-fill" variant="flat"></v-btn>
                                </template>

                                <template v-slot:default="{ isActive }">
                                    <v-card title="Delete?">
                                        <v-card-text>
                                            Are you sure you want to delete these item(s)?
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn text="No" @click="isActive.value = false"></v-btn>
                                            <v-btn text="Yes" @click="isActive.value = false"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
                            <v-text-field class="w-75 mw-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify"
                                hide-details clearable single-line variant="solo-filled"
                                v-model="search"></v-text-field>
                        </v-toolbar>
                    </template>
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                </v-data-table>

                <div style="margin: 4rem;"></div>

                <v-data-table class="rounded-xl" v-model:sort-by="sortBy" :headers="headers"
                    :items="example" v-model:items-per-page="itemsPerPage" item-value="name" item-key="name"
                    :search="search" :loading="loading" show-select v-model="selected">
                    <template v-slot:top>
                        <v-toolbar class="rounded-t-xl">
                            <ood_notify_vuetify v-if="ood" />
                            <v-toolbar-title>All Cases</v-toolbar-title>
                        </v-toolbar>
                        <v-toolbar>

                            <v-dialog max-width="400">
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn id="modal" height="55" width="100" v-bind="activatorProps"
                                        class="bg-#b71c1c bi bi-trash-fill" variant="flat"></v-btn>
                                </template>

                                <template v-slot:default="{ isActive }">
                                    <v-card title="Delete?">
                                        <v-card-text>
                                            Are you sure you want to delete these item(s)?
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn text="No" @click="isActive.value = false"></v-btn>
                                            <v-btn text="Yes" @click="isActive.value = false"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
                            <v-text-field class="w-75 mw-75 search-bar" label="Search" prepend-inner-icon="mdi-magnify"
                                hide-details clearable single-line variant="solo-filled"
                                v-model="search"></v-text-field>
                        </v-toolbar>
                    </template>
                    <template v-slot:loading>
                        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import notification from './notification.vue';
// import mainTable from './uploader/mainTable.vue';
import { ref, Ref } from 'vue'
import ood_notify_vuetify from './ood_notify_vuetify.vue';

// var databases = ref(null);
var ood = false;
var loading = ref(true);
var itemsPerPage = ref(10);
var search = ref("");
const upload_url = ref("whatever");

const sortBy = ref([{ key: 'size', order: 'desc' }]);
// const expanded = ref([]);

const headers = [
    { title: "CaseID", key: "caseID", sortable: true, filterable: false },
    { title: "Guid", key: "guid", sortable: true, filterable: false },
];

const example = [
    { caseID: 12345, guid: 'HERIEOEHEOEH' },
    { caseID: 678910, guid: 'HEEPIROEIEI' },
    { caseID: 231321, guid: 'HERERWHEIEER' },
    { caseID: 768263, guid: 'HEYUIEIRUIER' },
];
loading.value = false;

// function postCaseID() {
//     let cases = (document.getElementById("caseID") as HTMLInputElement).value;
//     alert(cases);
// }

async function copyMyText() {
    // let urlbox = document.getElementById("url");
    // urlbox.select();
    await navigator.clipboard.writeText(upload_url.value);
}

</script>

<script>
export default {
    data() {
        return {
            dialog: false,
        }
    },
}
</script>

<style scoped>
#modal {
    margin-left: .5rem;
    margin-right: .5rem;
    font-size: x-large;
    color: crimson;
}

.spacer {
    background-color: black;
    width: 75%;
    height: .1rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
}

.header {
    background-color: #e92e2e;
    padding: 20px;
    font-size: 20px;
    text-align: center;
    Color: white;
}

.text1 {
    color: white;
    text-align: left;
    margin: 1rem
}

.postBtn {
    border: 1px #ef3b32 solid;
    border-radius: 1rem;
    padding: .25rem;
    background-color: #ef3b32;
    color: whitesmoke;
}

.postBtn:hover {
    scale: 105%;
    transition: ease 0.5s;
}
</style>