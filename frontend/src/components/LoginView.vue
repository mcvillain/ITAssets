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
import VueCookies from "vue-cookies";

var strike = 1;
var x = 0;
var random = 0;
var token = 0;
localStorage.setItem("brotha", x);
localStorage.setItem("jwt", token);
localStorage.setItem("random", random);

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
        axios.get(import.meta.env.VITE_API_ENDPOINT + "/auth").then((resp) => {
            const auth_lvl = resp.data;
            console.log(auth_lvl);
            if (auth_lvl == 0 || auth_lvl == "0") {
                this.output = "Your session has expired. Please login again.";
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
                    if (auth_lvl.status == 200 && auth_lvl.data == "2") {
                        location.href = "/admin";
                    }
                    location.href = "/";
                } else if (loginReq.status == 401) {
                    // Unauthorized
                    VueCookies.remove("session_id");
                    this.output =
                        "Login failed. Check your username and password.";
                }
            } else {
                this.output = "Please specify your username and password.";
            }
            // try {
            //   if (this.input.username == 'aegis' && this.input.password == 'aegis') {
            //     const response = await axios.post(import.meta.env.VITE_API_ENDPOINT+'/login', {
            //       username: this.input.username,
            //       password: this.input.password,
            //     });

            //     token = response.data.token;
            //     const res = await axios.post(import.meta.env.VITE_API_ENDPOINT+'/auth', {});
            //     const word = res.data.code;
            //     const authHeader = `Bearer ${token}`;

            //     //local storages
            //     localStorage.setItem('brotha', word);
            //     localStorage.setItem('jwt', token);
            //     localStorage.setItem('header', authHeader);

            //     ///eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJldXdpcmx3amVoZ2Z5a2FiayxjIiwicGFzc3dvcmQiOiJwYm9pZHRuamhlZ3ZkaGprZ2ZkIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWXb9VM9Bxe-amtInmae7lJ7_1dx7pbfW3VONolyqsc
            //     // Redirect or perform other actions after successful login
            //     //this.$router.push('/servers')
            //     window.location.href = "/servers";
            //   } else if (this.input.username == 'admin' && this.input.password == 'Interns2023@Aegis') {
            //     const response = await axios.post(import.meta.env.VITE_API_ENDPOINT+'/login', {
            //       username: this.input.username,
            //       password: this.input.password,
            //     });

            //     random = '5nj28T9cktIUoB6cq3nPK8aPDBWoYr8pc5ERQAoH';
            //     const token = response.data.token;
            //     const authHeader = `Bearer ${token}`;

            //     //local storages
            //     localStorage.setItem('jwt', token);
            //     localStorage.setItem('header', authHeader);
            //     localStorage.setItem('random', random);

            //     ///eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJldXdpcmx3amVoZ2Z5a2FiayxjIiwicGFzc3dvcmQiOiJwYm9pZHRuamhlZ3ZkaGprZ2ZkIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWXb9VM9Bxe-amtInmae7lJ7_1dx7pbfW3VONolyqsc
            //     // Redirect or perform other actions after successful login
            //     this.$router.push('/admin')
            //   } else {
            //     this.output = 'Put in valid username & password';
            //     if (strike == 3) {
            //       document.getElementsByClassName("user")[0].style.visibility = 'hidden';
            //       document.getElementsByClassName("pass")[0].style.visibility = 'hidden';
            //     } else {
            //       strike = strike + 1;
            //     }
            //   }
            // } catch (error) {
            //   // Handle login error
            //   //console.error('Error: ', error);
            // }
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
