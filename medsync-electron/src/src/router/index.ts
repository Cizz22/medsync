import { createRouter, createWebHistory } from "vue-router";
import Signin from "../views/Signin.vue";
import Signup from "../views/Signup.vue"
import DashboardVue from "../views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path:"/dashboard",
    name:"Dashboard",
    component:DashboardVue
  },
  {
    path: "/sign-in",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/sign-up",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VITE_DEV_SERVER_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
