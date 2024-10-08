import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import HousePage from '@/views/HousePage.vue'
import LoginSignUpPage from '@/views/LoginSignUpPage.vue'
import AccountPage from '@/views/AccountPage.vue'


// import About from '@/views/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/house-page/:houseId',
    name: 'HousePage',
    component: HousePage
  },
  {
    path: '/account/:accountActionType',
    name: 'LoginSignUpPage',
    component: LoginSignUpPage
  },

  {
    path: '/account/info',
    name: 'AccountPage',
    component: AccountPage
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
