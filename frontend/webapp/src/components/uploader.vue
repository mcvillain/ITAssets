<template>
    <notification />
    <div class="" style=" justify-content: center; align-content: center; ;">
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
        <div class="spacer">
        </div>
        <mainTable table_data_endpoint="uploader/all_cases" />
    </div>
</template>

<script setup lang="ts">
import notification from './notification.vue';
import mainTable from './uploader/mainTable.vue';
//import { ref, Ref} from 'vue'
//const search: Ref<string> = ref('')

function postCaseID() {
    let cases = (document.getElementById("caseID") as HTMLInputElement).value;
    alert(cases);
}

async function copyMyText() {
    let urlbox = document.getElementById("url") as HTMLInputElement;
    urlbox.select();
    await navigator.clipboard.writeText(urlbox.value);
}

</script>

<style scoped>
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
    border: 1px #e92e2e solid;
    border-radius: 1rem;
    padding: .25rem;
    background-color: #ef3b32;
    color: whitesmoke;
}

.postBtn:hover {
    scale: 105%;
    transition: ease 0.5s;
}

.center {
    margin-top: 5rem;
    align-self: center;
    height: 600px;
    /* max-height: 600px; */
    width: 2000px;
    background-color: hsla(200, 40%, 30%, .4);
    background-image:
        url('https://78.media.tumblr.com/cae86e76225a25b17332dfc9cf8b1121/tumblr_p7n8kqHMuD1uy4lhuo1_540.png'),
        url('https://78.media.tumblr.com/66445d34fe560351d474af69ef3f2fb0/tumblr_p7n908E1Jb1uy4lhuo1_1280.png'),
        url('https://78.media.tumblr.com/8cd0a12b7d9d5ba2c7d26f42c25de99f/tumblr_p7n8kqHMuD1uy4lhuo2_1280.png'),
        url('https://78.media.tumblr.com/5ecb41b654f4e8878f59445b948ede50/tumblr_p7n8on19cV1uy4lhuo1_1280.png'),
        url('https://78.media.tumblr.com/28bd9a2522fbf8981d680317ccbf4282/tumblr_p7n8kqHMuD1uy4lhuo3_1280.png');
    background-repeat: repeat-x;
    background-position:
        0 20%,
        0 100%,
        0 50%,
        0 100%,
        0 0;
    background-size:
        2500px,
        800px,
        500px 200px,
        1000px,
        400px 260px;
    animation: 50s para infinite linear;
}

@keyframes para {
    100% {
        background-position:
            -5000px 20%,
            -800px 95%,
            500px 50%,
            1000px 100%,
            400px 0;
    }
}

</style>