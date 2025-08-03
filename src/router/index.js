// 导入 Vue Router 的核心函数和组件
import { createRouter, createWebHistory } from 'vue-router' // createRouter 用于创建路由实例，createWebHistory 用于启用 HTML5 历史模式
import Home from '@/views/Home.vue' // 导入首页组件
import Login from '@/views/Login.vue' // 导入登录页面组件
import Register from '@/views/Register.vue' // 导入注册页面组件
import Forget from '@/views/Forget.vue' // 导入密码重置页面组件

// 定义路由配置数组
const routes = [
  {
    path: '/index', // 主路由路径
    alias: ["/home", "/"], // 设置别名，允许通过 /home 或 / 访问首页
    name: 'home', // 路由名称，用于命名导航
    component: Home, // 关联的组件为 Home.vue
    meta: { requiresAuth: true }, // 元数据，标记此路由需要身份验证
    redirect: '/index/Dashboard', // 默认重定向到 Dashboard 子路由
    children: [ // 定义嵌套子路由
      { path: 'Dashboard', component: () => import('@/views/main/Dashboard.vue') }, // 仪表盘页面，懒加载
      { path: 'Profile', component: () => import('@/views/main/Profile.vue') }, // 个人资料页面，懒加载
      { path: 'Settings', component: () => import('@/views/main/Settings.vue') } // 设置页面，懒加载
    ]
  },
  {
    path: '/login', // 登录页面路由
    name: 'login', // 路由名称
    component: Login // 关联的组件为 Login.vue
  },
  {
    path: '/register', // 注册页面路由
    name: 'register', // 路由名称
    component: Register // 关联的组件为 Register.vue
  },
  {
    path: '/forget', // 密码重置页面路由
    name: 'forget', // 路由名称
    component: Forget // 关联的组件为 Forget.vue
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 历史模式（无 # 号的 URL）
  routes // 传入路由配置
})

// 路由守卫，拦截每次路由导航
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // 检查本地存储中是否存在 token，判断用户是否已登录
  if (to.meta.requiresAuth && !isAuthenticated) { // 如果目标路由需要认证且用户未登录
    next('/login') // 重定向到登录页面
  } else {
    next() // 允许继续导航
  }
})

// 导出路由实例，供 main.js 或其他文件使用
export default router