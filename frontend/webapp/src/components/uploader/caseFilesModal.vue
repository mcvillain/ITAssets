<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn block variant="flat" v-bind="activatorProps" :text="case_id" @click="loadCaseData"></v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card :title="'Case ' + case_id">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field :readonly="true" label="Case Owner" v-model="case_owner"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field :readonly="true" :hint="upload_url_hint"
                                :persistent-hint="upload_url_hint_persist" label="Upload Link" v-model="upload_url"
                                append-inner-icon="mdi-content-copy" @click:append-inner="copyUploadUrl"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6"
                            style="display: flex; justify-content: center; align-content: center;">
                            <!-- Toggle Case Link Button -->
                            <v-btn :icon="case_link_active?'mdi-link-variant':'mdi-link-variant-off'" :ripple="true" @click="toggle_link_active" />
                            <!-- Delete All Button -->
                            <v-dialog max-width="25%">
                                <template v-slot:activator="{ props: activatorPropsV2 }">
                                    <v-btn text="Delete All Case Files" prepend-icon="mdi-trash-can"
                                        append-icon="mdi-trash-can" color="red" v-bind="activatorPropsV2"></v-btn>
                                </template>
                                <template v-slot:default="{ isActive }">
                                    <v-card :title="`Delete all files for case ${case_id}?`">
                                        <v-card-text v-if="delete_error">{{ delete_error_msg }}</v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red" :loading="deleting" prepend-icon="mdi-trash-can"
                                                append-icon="mdi-trash-can" text="DELETE" variant="flat"
                                                @click="deleteFiles" />
                                            <v-btn color="primary" :disabled="deleting" text="Close"
                                                @click="isActive.value = false" />
                                        </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
                    :items-length="totalItems" :loading="loading" :search="search" item-value="name"
                    @update:options="loadItems" class="centered-table">
                    <template v-slot:top>
                        <v-toolbar class="rounded-t-xl">
                            <v-toolbar-title>Files</v-toolbar-title>
                        </v-toolbar>
                        <!-- TABLE HEADER -->
                        <v-toolbar>
                            <div class="tb-row">
                                <v-text-field class="w-75 mw-75 search-bar" label="Search"
                                    prepend-inner-icon="mdi-magnify" hide-details clearable single-line
                                    variant="solo-filled" v-model="search"></v-text-field>
                                <!-- <v-btn icon="mdi-table-arrow-down" size="large" href="/api/LocalDatabases.csv"
                                        download></v-btn> -->
                            </div>
                        </v-toolbar>
                    </template>
                    <!-- Labels for Upload Progress -->
                    <template v-slot:item.upload_complete="{ value }">
                        <v-chip :color="value == 1 ? 'green' : value == -1 ? 'red' : 'purple'" :text="value == 1 ? 'Complete' : value == -1? 'Failed' : 'In Progress'"
                            class="text-uppercase" style="margin-left: 1rem; margin-right: 1rem;" size="small"
                            label></v-chip>
                    </template>
                    <!-- Show Size in GB -->
                    <template v-slot:item.file_size="{ value }">
                        {{ (value as number)>0?bytesToHumanReadable(value as number):'0' }}
                    </template>
                    <!-- Creation Date Column -->
                    <template v-slot:item.uploaded_at="{ value }">
                        {{ new Date(value).toLocaleString() }}
                    </template>
                </v-data-table-server>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text="Close" @click="isActive.value = false">
                    </v-btn>
                </v-card-actions>
            </v-card>
            <!-- Popup -->
            <v-snackbar v-model="popup" timeout="1000" transition="fab-transition" :text="popup_text" position="absolute" location-strategy="static" location="top right" />
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    case_id: String,
});

const case_owner = ref('');
const upload_url = ref('');
const upload_url_hint = ref('');
const upload_url_hint_persist = ref(false);

const deleting = ref(false);
const delete_error = ref(false);
const delete_error_msg = ref('');

const itemsPerPage = ref(5);
const headers = [
    { title: "File Name", sortable: true, key: 'file_path' },
    { title: "File Size", sortable: true, key: 'file_size' },
    { title: "Started At", sortable: true, key: 'uploaded_at' },
    { title: "Upload Status", sortable: true, key: 'upload_complete' },
];
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

const popup = ref(false);
const popup_text = ref('');
const case_link_active = ref(true);

function loadItems(options: any) {
    loading.value = true;
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/uploads/get_case_files/${props.case_id}`, {
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

function popmsg(msg: string) {
    popup_text.value = msg;
    popup.value = true;
}

async function toggle_link_active() {
    try {
        await fetch(`${import.meta.env.VITE_API_ENDPOINT}/uploads/toggle_upload_url/${props.case_id}`);
        loadCaseData();
    } catch (err) {
        popmsg("Error toggling link...");
        console.error(err);
    }
}

function loadCaseData() {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/uploads/get_case_owner/${props.case_id}`).then(async resp => {
        if (!resp.ok) return;
        const data: any = await resp.json();
        case_owner.value = data.owner;
        upload_url.value = `${data.itar ? import.meta.env.VITE_UPLOAD_ITAR_URL : import.meta.env.VITE_UPLOAD_URL}/?id=${data.guid}`;
        case_link_active.value = data.upload_url_active==1;
    }).catch(err => {
        popmsg("Error loading case data...")
        console.error(err);
    });
}

async function copyUploadUrl() {
    await navigator.clipboard.writeText(upload_url.value);
    popmsg("Copied to clipboard!");
    upload_url_hint.value = "Copied to clipboard!";
    upload_url_hint_persist.value = true;
    setTimeout(() => {
        upload_url_hint.value = "";
        upload_url_hint_persist.value = false;
    }, 2000);
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

function deleteFiles() {
    deleting.value = true;
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/uploads/delete_all_case_files/${props.case_id}`, { method: 'DELETE' }).then(async resp => {
        if (!resp.ok) {
            delete_error.value = true;
            delete_error_msg.value = await resp.text();
        }
        deleting.value = false;
        if (resp.ok) location.reload();
    }).catch(err => {
        delete_error.value = true;
        delete_error_msg.value = err;
        deleting.value = false;
    });
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