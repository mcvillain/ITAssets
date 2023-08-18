<script>
import { provide } from 'vue';
import { collapsed, toggleSidebar, sidebarWidth, } from './state';
import toggleDataTable from './state';
import { useRouter } from 'vue-router';
export default {
    props: {},
    methods: {
        redirectServers() {
            window.location.href = "/servers";
        },
        redirectDatabases() {
            window.location.href = "/databases";
        },
        redirectCldDatabases() {
            window.location.href = "/clddatabases";
        },
        redirectAbout() {
            window.location.href = "/about";
        },
        redirectUsers() {
            window.location.href = "/users";
        },
        redirectHelp() {
            window.location.href = "/help";
        }
    },
    setup() {
        const router = useRouter();
        setTimeout(() => {
            const route = router.currentRoute.value.fullPath;
            console.log(route)
            function updateIcons() {
                //change on route
                if (route == '/servers') {
                    [...document.getElementsByClassName("server-icon")].forEach(element => {
                        element.classList.add("active");
                    });
                } else if (route == '/databases') {
                    [...document.getElementsByClassName("database-icon")].forEach(element => {
                        element.classList.add("active");
                    });
                } else if (route == '/clddatabases') {
                    [...document.getElementsByClassName("cloud-database-icon")].forEach(element => {
                        element.classList.add("active");
                    });
                } else if (route == '/users') {
                    [...document.getElementsByClassName("user-icon")].forEach(element => {
                        element.classList.add("active");
                    });
                } else if (route == '/about') {
                    [...document.getElementsByClassName("about-icon")].forEach(element => {
                        element.classList.add("active");
                    });
                } else if (route == '/help') {
                    [...document.getElementsByClassName("help-icon")].forEach(element => {
                        element.classList.add("active");
                    });
                }
            }
            updateIcons();
        }, 50);
        provide('toggleDataTable', toggleDataTable);
        return {
            collapsed,
            toggleSidebar,
            sidebarWidth,
        };
    }
};

</script>

<template>
    <div class="sidebar" :style="{ width: sidebarWidth }">
        <div class="collapse-icon" @click="redirectServers" style="display: flex; flex-direction: row;">
            <a href="/servers"><img class="pic" src="/src/assets/Aegis-Logo-Transparent-Backgrounds.png"></a>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK0">IT Assets</p>
            </span>
        </div>
        <div class="spacer"></div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="redirectServers"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-pc-display server-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Servers</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="redirectDatabases"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-database-fill database-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Internal DB</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="redirectCldDatabases"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-cloud cloud-database-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Azure DB</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="redirectUsers"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-person-circle user-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Users</p>
            </span>
        </div>
        <div class="item" :class="collapsed && 'item collapsed'" @click="redirectAbout"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-chat-square-text-fill about-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">About</p>
            </span>
        </div>
        <div class="spacer"></div>

        <div class="item" :class="collapsed && 'item collapsed'" style="display: flex; flex-direction: row;">
            <a href="mailto:helpdesk@aiscorp.com?subject=IT Support" id="help-icon" class="label-DONTBREAK"><i
                    class="bi bi-envelope help-icon"></i></a>
            <span v-if="!collapsed">
                <a href="mailto:helpdesk@aiscorp.com?subject=IT Support" id="help-link"> Support</a>
            </span>
        </div>
        <!--<div class="item" :class="collapsed && 'item collapsed'" @click="redirectHelp" style="display: flex; flex-direction: row;">
            <i class="bi bi-question-circle-fill help-icon"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK">Help</p>
            </span>
        </div>-->
        <div class="item" :class="collapsed && 'item collapsed'" @click="toggleSidebar"
            style="display: flex; flex-direction: row;">
            <i class="bi bi-layout-sidebar sidebar-toggler"></i>
            <span v-if="!collapsed">
                <p class="label-DONTBREAK2">Collapse</p>
            </span>
        </div>
    </div>
</template>

<style>
:root {
    --sidebar-bg-color: #27272d;
    --sidebar-item-hover: white;
    --sidebar-item-active: #ef3b32;
}
</style>

<style scoped>
.sidebar-toggler {
    font-size: 3rem;
    color: #708490;
}

.item {
    padding-left: 0.75rem;
}

.server-icon {
    font-size: 3rem;
    color: #708490;
}

.server-icon.active {
    color: #ef3b32;
}

.database-icon {
    font-size: 3rem;
    color: #708490;
}

.database-icon.active {
    color: #ef3b32;
}
.cloud-database-icon {
    font-size: 3rem;
    color: #708490;
}

.cloud-database-icon.active {
    color: #ef3b32;
}

.about-icon {
    font-size: 3rem;
    color: #708490;
}

.about-icon.active {
    color: #ef3b32;
}

.user-icon {
    font-size: 3rem;
    color: #708490;
}

.user-icon.active {
    color: #ef3b32;
}

.help-icon {
    font-size: 3rem;
    color: #708490;
}

.help-icon.active {
    color: #ef3b32;
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

.collapse-icon {
    position: absolute;
    top: 0;
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
}</style>
