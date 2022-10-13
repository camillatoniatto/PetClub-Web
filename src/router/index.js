import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/Services.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/Users.vue')
  },
  {
    path: '/pets',
    name: 'pets',
    component: () => import('../views/Pets.vue')
  },
  {
    path: '/scheduler',
    name: 'scheduler',
    component: () => import('../views/Scheduler.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/cashflow',
    name: 'cashflow',
    component: () => import('../views/CashFlow.vue')
  },
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.baseURL,
  routes
})

router.beforeEach(async (to, from, next) =>  {
  if (Date(localStorage.getItem('dateExpire') < Date.now())) {
    next();
  }
  else{
    // logout()
    next({ path: '/login' });
  }
});

export default router