import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DocumentTranslation from '../views/DocumentTranslation.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/api',
      name: 'API',
      component: () => import('../views/Api.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/document',
      name: 'document',
      component: DocumentTranslation
    }
  ]
})

export default router 