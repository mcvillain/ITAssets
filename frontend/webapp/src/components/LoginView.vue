<template>
    <div class="page_root">
        <img style="height: 9rem;" src="/src/assets/aegislogo.png" />
        <div class="spacer"></div>
        <h3>{{ this.output }}</h3>
        <div class="spacer"></div>
        <div @click="signin" class="signin_button"></div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "LoginView",
    data() {
        return {
            output: "",
        };
    },
    mounted() {
        axios.get(import.meta.env.VITE_API_ENDPOINT + "/auth", { withCredentials: true }).then((resp) => {
            const auth_lvl = resp.data.auth_lvl;
            console.log(resp);
            if (auth_lvl == 0) {
                this.output = "Your session has expired. Please login again.";
            } else if (auth_lvl == 1 || auth_lvl == 2) {
                location.href = "/servers";
            } else if (auth_lvl == 3) {
                location.href = "/admin";
            }
        });
    },
    methods: {
        signin() {
            location.href = "/api/ms_auth";
        },
    },
};
</script>

<style scoped>
.page_root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.signin_button {
    background-image: url(/src/assets/ms-symbollockup_signin_light.svg);
    height: 2.56rem;
    width: 13.43rem;
}

.spacer {
    height: 2rem;
    width: 2rem;
}
</style>
