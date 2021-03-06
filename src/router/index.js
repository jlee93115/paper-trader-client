import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import { isAuthenticated } from '../api/UsersApi.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    isAuthenticated()
      .then(() => {
        next();
      })
      .catch(() => {
        next('/login');
      })
  }
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    isAuthenticated()
      .then(() => {
        next('/dashboard');
      })
      .catch(() => {
        next();
      })
  }
  else {
    next();
  }
});

export default router
