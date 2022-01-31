import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/about",
    name: "About",
    meta: {
      requiresAuth: false,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const hasToken = !!store.getters.token;

  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    if (!hasToken) {
      next({ name: "Login" });
    } else {
      store
        .dispatch("getCurrentUser")
        .then(() => {
          next();
        })
        .catch(() => {
          store.dispatch("logout");
        });
    }
  } else if (to.name === "Login" && hasToken) {
    store
      .dispatch("getCurrentUser")
      .then(() => {
        next({ name: "Home" });
      })
      .catch(() => {
        store.dispatch("logout");
      });
  } else {
    next();
  }
});

export default router;
