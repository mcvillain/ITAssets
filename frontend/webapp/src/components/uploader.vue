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
                    <CurrentUserCasesTable />
                    <div style="margin: 4rem;"></div>
                    <AllCasesTable />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import notification from './notification.vue';
// import mainTable from './uploader/mainTable.vue';
import { ref, Ref } from 'vue'
import CurrentUserCasesTable from './uploader/currentUserCasesTable.vue';
import AllCasesTable from './uploader/allCasesTable.vue';

async function copyMyText() {
    await navigator.clipboard.writeText(upload_url.value);
}

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