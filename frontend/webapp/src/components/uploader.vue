<template>
    <notification />
    <h2 style="align-content: center; margin-top: 2rem; margin-bottom: 1rem; font-size: xx-large;">Aegis Uploader</h2>

    <div style="margin: 3rem;"></div>
    <div style="padding-left: 2rem; padding-right: 2rem;">
        <v-row>
            <v-col cols="12" md="5">
                <v-text-field clearable label="Case ID" :hint="case_id_hint" :persistent-hint="case_id_hint_persist" v-model="case_id" />
            </v-col>
            <v-col cols="12" md="2">
                <v-btn min-height="56px" text="Get Upload URL" @click="get_upload_url"></v-btn>
            </v-col>
            <v-col cols="12" md="5">
                <v-text-field :readonly="true" label="Upload Link" v-model="upload_url"
                    append-inner-icon="mdi-content-copy" @click:append-inner="copyUploadUrl" />
            </v-col>
        </v-row>
    </div>

    <div style="margin: 3rem;">

        <div class="card m-3">
            <div class="card-body">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <AllCasesTable v-if="current_user_cases_endpoint!==''" title="My Cases" :endpoint="current_user_cases_endpoint" :key="rerender" />
                    <div style="margin: 4rem;"></div>
                    <AllCasesTable title="All Cases" :endpoint="all_cases_endpoint" :key="rerender" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import notification from './notification.vue';
// import mainTable from './uploader/mainTable.vue';
import { ref } from 'vue'
import AllCasesTable from './uploader/allCasesTable.vue';

const rerender = ref(0);

const all_cases_endpoint = ref("/uploads/get_all_cases");
const current_user_cases_endpoint = ref('');
const current_user = ref('')
fetch(import.meta.env.VITE_API_ENDPOINT + "/auth", { credentials: 'include' }).then((resp) => { if (resp.status === 401) { location.href = '/'; } return resp.json() }).then((body) => { let auth_lvl = body.auth_lvl; if (!(auth_lvl == 1 || auth_lvl == 2 || auth_lvl == 3)) { location.href = '/'; } current_user.value = body.username; current_user_cases_endpoint.value = `/uploads/get_user_cases/${encodeURIComponent(body.username)}`; });


const case_id = ref('');
const upload_url = ref('');
const case_id_hint = ref('');
const case_id_hint_persist = ref(false);

async function get_upload_url() {
    let headers = {};
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/uploads/request_upload_url/${case_id.value}`).then(async resp => {
        if (resp.ok) {
            const data = await resp.json();
            upload_url.value = `${data.itar?import.meta.env.VITE_UPLOAD_ITAR_URL:import.meta.env.VITE_UPLOAD_URL}/?id=${data.uuid}`;
            rerender.value++;
            return;
        } else {
            case_id_hint.value = "Invalid Case ID -- YO MAMMA";
            case_id_hint_persist.value = true;
        }
    }).catch(err => console.error(err));
}

async function copyUploadUrl() {
    await navigator.clipboard.writeText(upload_url.value);
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