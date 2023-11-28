import { createRouter, createWebHistory } from 'vue-router'
import AdminLayoutView from '@/views/AdminLayoutView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: AdminLayoutView
    }
  ]
})

export default router
