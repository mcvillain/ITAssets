<template>
    <div class="page_root">
        <img v-if="theme.global.current.value.dark" style="height: 9rem;" src="/src/assets/aegislogo_dark.png" />
        <img v-else style="height: 9rem;" src="/src/assets/aegislogo.png" />
        <div class="spacer"></div>
        <h3>{{ output }}</h3>
        <div class="spacer"></div>
        <div @click="signin" :class="'signin_button ' + (theme.global.current.value.dark ? 'dark_mode' : 'light_mode')"></div>
    </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useTheme } from 'vuetify';

const theme = useTheme();

const output = ref("");

onMounted(() => {
    axios.get(import.meta.env.VITE_API_ENDPOINT + "/auth", { withCredentials: true }).then((resp) => {
        const auth_lvl = resp.data.auth_lvl;
        console.log(resp);
        if (auth_lvl == 0) {
            output.value = "Your session has expired. Please login again.";
        } else if (auth_lvl == 1 || auth_lvl == 2) {
            location.href = "/servers";
        } else if (auth_lvl == 3) {
            location.href = "/admin";
        }
    });
});
function signin() {
    location.href = "/api/ms_auth";
}
</script>

<style scoped>
.page_root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.signin_button {
    height: 2.56rem;
    width: 13.43rem;
}

.signin_button.light_mode {
    background-image: url(/src/assets/ms-symbollockup_signin_light.svg);
}

.signin_button.dark_mode {
    background-image: url(/src/assets/ms-symbollockup_signin_dark.svg);
}

.spacer {
    height: 2rem;
    width: 2rem;
}
</style>
