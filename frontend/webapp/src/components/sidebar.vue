<template>

    <div class="sidebar" :style="{ width: sidebarWidth }">
        <div class="collapse-icon" @click="goto('/')" style="display: flex; flex-direction: row;">
            <img class="pic" src="/src/assets/Aegis-Logo-Transparent-Backgrounds.png">
            <span v-if="!collapsed">
                <p class="label-DONTBREAK0">IT Assets</p>
            </span>
        </div>
        <div class="shred" v-if="route !== '/'">Logged in as:<br />{{ username }}</div>
        <div class="spacer"></div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="goto('/servers')"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-pc-display nav-icon" id="servers-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Servers</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="goto('/databases')"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-database-fill nav-icon" id="internal_dbs-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Internal DB</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="goto('/clddatabases')"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-cloud nav-icon" id="azure_dbs-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Azure DB</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="goto('/users')"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-person-circle nav-icon" id="users-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Users</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="goto('/uploader')"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-cloud-upload nav-icon" id="uploader-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Uploader</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="goto('/about')"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-chat-square-text-fill nav-icon" id="about-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">About</p>
            </span>
        </div>
        <div class="spacer"></div>

        <div class="item" :class="collapsed && 'item collapsed'" style="display: flex; flex-direction: row;">
            <a href="mailto:helpdesk@aiscorp.com?subject=IT Support" id="help-icon" class="label-DONTBREAK"><i
                    class="bi bi-envelope nav-icon"></i></a>
            <span v-if="!collapsed">
                <a href="mailto:helpdesk@aiscorp.com?subject=IT Support" id="help-link"> Support</a>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" style="display: flex; flex-direction: row;">
            <a href="/api/logout_redirect">
                <i class="bi bi-box-arrow-left nav-icon"></i></a>
            <span v-if="!collapsed">
                <a href="/api/logout_redirect">
                    <p class="label-DONTBREAK">Logout</p>
                </a>
            </span>

        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="toggleSidebar"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-layout-sidebar sidebar-toggler"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK2">Collapse</p>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { collapsed, toggleSidebar, sidebarWidth, } from './state';
import toggleDataTable from './state';

const route = location.pathname;

function goto(path: string) {
    location.href = path;
}

const username = ref("");
if (route !== '/') {
    // Get username & make sure the user is authed
    fetch(import.meta.env.VITE_API_ENDPOINT + "/auth", { credentials: 'include' }).then((resp) => { if (resp.status === 401) { location.href = '/'; } return resp.json() }).then((body) => { let auth_lvl = body.auth_lvl; if (!(auth_lvl == 1 || auth_lvl == 2 || auth_lvl == 3)) { location.href = '/'; } username.value = body.username; });
}

onMounted(() => {
    switch (route) {
        case '/servers':
            document.getElementById("servers-icon")?.classList.add("active");
            break;
        case '/databases':
            document.getElementById("internal_dbs-icon")?.classList.add("active");
            break;
        case '/clddatabases':
            document.getElementById("azure_dbs-icon")?.classList.add("active");
            break;
        case '/users':
            document.getElementById("users-icon")?.classList.add("active");
            break;
        case '/uploader':
            document.getElementById("uploader-icon")?.classList.add("active");
            break;
        case '/about':
            document.getElementById("about-icon")?.classList.add("active");
            break;
        default:
            break;
    }
})
</script>

<style>
:root {
    --sidebar-bg-color: #27272d;
    --sidebar-icon-color: #708490;
    --sidebar-item-hover: white;
    --sidebar-item-active: #ef3b32;
}
</style>

<style scoped>
.shred {
    line-break: anywhere;
    word-break: break-all;
}

#username_float {
    display: block;
    position: absolute;
    top: 2rem;
    right: 2rem;
}

.nav-icon {
    font-size: 3rem;
    color: var(--sidebar-icon-color);
}

.nav-icon.active {
    color: var(--sidebar-item-active);
}

.nav-icon:hover {
    color: #15779f;
}

.spacer {
    flex-grow: 10;
}

.label-DONTBREAK {
    color: lightgray;
    padding-top: 1.5rem;
    padding-left: 1rem;
}

.label-DONTBREAK2 {
    color: lightgray;
    padding-top: 1.5rem;
    padding-left: 1rem;
}

.label-DONTBREAK0 {
    color: lightgray;
    padding-top: 1rem;
    padding-left: 1rem;
    font-weight: bold;
}

.sidebar {
    color: #708490;
    background-color: var(--sidebar-bg-color);
    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0.5em;
    transition: 0.3s, ease;
    display: flex;
    flex-direction: column;
    width: 200px;
}

@media print {
    .sidebar {
        display: none !important;
    }
}

.sidebar-toggler {
    font-size: 3rem;
    color: #708490;
}

.sidebar-toggler:hover {
    color:#15779f;
}

#about-icon:hover {
    color: #15779f;
}

#uploader-icon:hover {
    color: #15779f;
}

#users-icon:hover {
    color: #15779f;
}

#servers-icon:hover {
    color: #15779f;
}

#azure_dbs-icon:hover {
    color: #15779f;
}

#internal_dbs-icon:hover {
    color: #15779f;
}

.item {
    padding-left: 0.75rem;
}


.collapse-icon {
    /* position: absolute;
    top: 0; */
    padding: 0.75em;
}

.collapse-icon:hover {
    transform: scale(115%);
}

.pic {
    height: 50px;
    width: 50px;
}

#dt {
    top: 375px;
}

#dataLabel {
    top: 375px;
}

.textLabel {
    display: inline-block;
    bottom: 25px;
    left: 75px;
    position: absolute;
}

#databasesLabel {
    bottom: 32px;
    position: absolute;
}

#help-icon {
    color: lightgray;
    text-decoration: none;
    padding-left: .15rem;
}

#help-link {
    color: lightgray;
    text-decoration: none;
    vertical-align: -3rem;
    padding-left: 1rem;
}


</style>