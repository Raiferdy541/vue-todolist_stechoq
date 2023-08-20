import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { d$auth } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/ListView.vue'),
      meta: { auth: true } // protected route
    },
    {
      path: '/profile',
      // nested routes
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/views/Profile/LoginView.vue')
        },
        {
          // optional and dynamic params
          path: 'detail/:id?',
          name: 'Authenticated',
          component: () => import('@/views/Profile/AuthenticatedView.vue'),
          meta: { auth: true } // protected route
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Match All',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // get auth state
  const loggedIn = d$auth().isLoggedIn
  // if target route requires auth & no logged in user
  // redirect to login
  if (to.meta.auth && !loggedIn) {
    next({ name: 'Login' })
  } else {
    // else then proceeds
    next()
  }
})


export default router
