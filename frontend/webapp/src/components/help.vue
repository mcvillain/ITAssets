<template>
    <notification />
    <b class=heading>Help</b>
    <p>Create a ticket by emailing help desk</p>
    <a href="mailto:helpdesk@aiscorp.com?subject=IT Support" class="help-link"><i class="bi bi-envelope help-icon"></i> Get
        help</a>
</template>
 
<script>
import notification from './notification.vue';
</script>
 
<style scoped>
.heading {
    font-size: xx-large;
}

.help-icon {
    font-size: larger;
    color: black;
}

.help-link {
    font-size: larger;
    text-decoration: none;
    color: black;
    vertical-align: middle;
}</style>