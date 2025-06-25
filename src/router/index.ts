import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import patientRouter from "@/modules/patient/router";
import medicRouter from "@/modules/medic/router";
import authRouter from "@/modules/auth/router";
import isAuthenticatedGuard from "@/modules/auth/router/auth-guard";
//import useAuth from "@/modules/auth/composables/useAuth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/patient/home",
  },
  {
    path: "/notifications",
    name: "notifications",
    beforeEnter: [isAuthenticatedGuard],
    component: () => import("@/views/NotificationsPage.vue"),
  },
  ...authRouter,
  ...patientRouter,
  ...medicRouter,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
