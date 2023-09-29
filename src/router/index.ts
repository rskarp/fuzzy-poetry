import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/overview',
      name: 'overview',
      // route level code-splitting
      // this generates a separate chunk (ProjectOverview.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProjectOverview.vue')
    },
    {
      path: '/context',
      name: 'context',
      component: () => import('../views/ProjectContext.vue')
    },
    {
      path: '/contributors',
      name: 'contributors',
      component: () => import('../views/Contributors.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/how-it-works',
      name: 'how-it-works',
      component: () => import('../views/HowItWorksView.vue')
    }
  ]
})

export default router
