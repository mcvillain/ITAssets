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
        <div class="item" :class="collapsed && 'item collapsed'" @click="toggleTheme"
            style="display: flex; flex-direction: row;">
            <div style="max-width: 3rem; max-height: 3rem;"><svg class="v-icon__svg" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path
                        d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z">
                    </path>
                </svg></div>
            <!-- <i class="bi bi-layout-sidebar sidebar-toggler"></i> -->
            <span v-if="!collapsed">
                <p class="label-DONTBREAK2" style="padding-top: 0;">Toggle<br />Theme</p>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { collapsed, toggleSidebar, sidebarWidth, } from './state';
import toggleDataTable from './state';
import { useTheme } from 'vuetify';

const theme = useTheme();
const route = location.pathname;

function getCookie(cookieName:string): string {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cookieName: string, cookieValue: string) {
    let secureFlag = ";secure";
    let path = ";path=/";
    let expires = ";expires=Fri, 31 Dec 9999 23:59:59 GMT"; // Set the expiry date to a far future date so the cookie never expires
    document.cookie = cookieName + "=" + cookieValue + expires + path + secureFlag;
}



function goto(path: string) {
    location.href = path;
}

function toggleTheme() {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    setCookie("theme", newTheme);
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
    const cached_theme = getCookie('theme');
    if (cached_theme.length > 0)
        theme.global.name.value = cached_theme;
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
.item:hover{
  cursor: pointer;
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
