import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/',
      component: () => import('../layout/layout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/Index-page.vue')
        },
        {
          path: '/create',
          name: 'create',
          component: () => import('../views/create/Create-page.vue')
        },
        {
          path: '/hive',
          name: 'hive',
          component: () => import('../views/hive/Hive-page.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const address = localStorage.address
  if (to.path == '/hive') {
    if (address) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})
export default router
