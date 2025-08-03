import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Forget from '@/views/Forget.vue'

const routes = [
  {
    path: '/index',
    alias:["/home","/"],
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
    redirect:'/index/Dashboard',
    children:[
        {path:'Dashboard',component:()=>import('@/views/main/Dashboard.vue')},
        {path:'Profile',component:()=>import('@/views/main/Profile.vue')},
        {path:'Settings',component:()=>import('@/views/main/Settings.vue')}
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/forget',
    name: 'forget',
    component: Forget
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
