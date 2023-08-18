<script>
import { ref } from 'vue';
import router from './router/index.js';
const random = localStorage.getItem('random');

if(random != '5nj28T9cktIUoB6cq3nPK8aPDBWoYr8pc5ERQAoH'){
    router.push('/');
}

export default {
    data() {
        return {
            message: ref(''),
            sendMsg: "",
            currentTime: ""
        }
    },

    methods: {
        async fill() {
                if(random != '5nj28T9cktIUoB6cq3nPK8aPDBWoYr8pc5ERQAoH'){
                    router.push('/');
                }  
                let resp = await fetch("https://itassets.aiscorp.com:3000/messages/", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        auth: '6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t'
                    },

                    //make sure to serialize your JSON body
                    body: JSON.stringify({
                        message: this.message,
                        timestamp: Date.now()
                    })
                });
                this.sendMsg = resp.ok ? "Message Sent" : "Error sending message!";
            
        },
        async empty() {
            if(random != '5nj28T9cktIUoB6cq3nPK8aPDBWoYr8pc5ERQAoH'){
                router.push('/');
            }
                let resp = await fetch("https://itassets.aiscorp.com:3000/messages/", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        auth: '6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t'
                    },
                    body: JSON.stringify({
                        message: "",
                        timestamp: ""
                    })
                });
            
        }
    },
}
</script>

<template>
    <div>
        <input class="in" type="text" v-model="message" placeholder="Send a message">
        <button @click="fill()" style="border: 2px solid; padding: 5px"> Submit </button>
        <br/>
        <button @click="empty()" style="border: 2px solid; padding: 5px"> Remove Message</button>
    </div>
    <div>
        <p>{{ sendMsg }}</p>
    </div>
    <div>
        <input class="input" type="text" v-model="message" placeholder="Update Database GB Cost">
    </div>
</template>

<style scoped>
input {
    width: 50%
}

input::placeholder {
    text-align: center;
}
.in {
    /* border-radius: 1px !important; */
    padding: 2px 3px !important;
    outline-offset: 0 !important;
    outline: auto 2px !important;
    margin: 1rem !important;
}
.input{
    padding: 2px 3px !important;
    outline-offset: 0 !important;
    outline: auto 2px !important;
    margin: 1rem !important;
}

</style>