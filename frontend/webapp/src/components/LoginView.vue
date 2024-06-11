<template>
    <img height="150" src="/src/assets/aegislogo.png" />
    <form name="login-form">
        <div class="mb-3">
            <br />
            <br />
            <label for="username">Username </label>
            <input class="user" type="text" id="username" v-model="input.username" />
        </div>
        <div class="mb-3">
            <label for="password">Password: </label>
            <input class="pass" type="password" id="password" v-model="input.password" />
        </div>
        <button class="btn btn-outline-dark" type="submit" v-on:click.prevent="login()">
            Login
        </button>
    </form>
    <h3>{{ this.output }}</h3>
</template>

<script>
import axios from "axios";

export default {
    name: "LoginView",
    data() {
        return {
            input: {
                username: "",
                password: "",
            },
            output: "",
        };
    },
    mounted() {
        axios.get(import.meta.env.VITE_API_ENDPOINT + "/auth", { withCredentials: true }).then((resp) => {
            const auth_lvl = resp.data.auth_lvl;
            console.log(resp);
            if (auth_lvl == 0) {
                this.output = "Your session has expired. Please login again.";
            } else if (auth_lvl == 1) {
                location.href = "/servers";
            } else if (auth_lvl == 3) {
                location.href = "/admin";
            }
        });
    },
    methods: {
        async login() {
            if (
                this.input.username.length > 0 &&
                this.input.password.length > 0
            ) {
                const loginReq = await axios.post(
                    import.meta.env.VITE_API_ENDPOINT + "/login",
                    {
                        username: this.input.username,
                        password: this.input.password,
                    }, { withCredentials: true }
                );
                if (loginReq.status == 200) {
                    //Success
                    const auth_lvl = await axios.get(
                        import.meta.env.VITE_API_ENDPOINT + "/auth", { withCredentials: true }
                    );
                    if (auth_lvl.status == 200) {
                        if (auth_lvl.data.auth_lvl == 3)
                            location.href = "/admin";
                        else if (auth_lvl.data.auth_lvl == 1)
                            location.href = "/servers";
                    }
                    location.href = "/";
                } else if (loginReq.status == 401) {
                    // Unauthorized
                    this.output =
                        "Login failed. Check your username and password.";
                }
            } else {
                this.output = "Please specify your username and password.";
            }
        },
    },
};
</script>

<style scoped>
.pass {
    border: 1px solid rgb(183, 183, 214);
    background-color: rgb(247, 251, 253);
}

.user {
    border: 1px solid rgb(183, 183, 214);
    background-color: rgb(247, 251, 253);
}

.btn {
    width: 200px;
    background-color: rgb(247, 244, 244);
    border: 1px solid rgb(197, 197, 197);
}

.btn:hover {
    color: grey;
    scale: 105%;
    transition: ease 0.5s;
}
</style>
