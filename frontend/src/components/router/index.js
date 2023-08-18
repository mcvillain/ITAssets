import { createWebHistory, createRouter } from "vue-router";

  const routes =  [
    {
    path: "/",
    component: () => import('../LoginView.vue'),
  },
  {
    path: "/partymode=true",
    component: () => import('../party.vue'),
  },
  {
     path: "/admin",
     component: () => import('../message.vue'),
  },
  {
    path: "/users",
    component: () => import('../Users.vue'),
  },
  {
    path: "/servers",
    component: () => import('../serversPage.vue'),
  }, 
  {
    path: "/databases",
    component: () => import('../databasesPage.vue'),
  },
  {
    path: "/clddatabases",
    component: () => import('../cloudDB.vue'),
  },
  {
    path: "/about",
    component: () => import('../aboutPage.vue'),
  },
  {
    path: "/help",
    component: () => import('../help.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
  linkActiveClass: 'active'
})

export default router;