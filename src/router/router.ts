import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomePage from '@/views/HomePage.vue'
import HousePage from '@/views/HousePage.vue'
import LoginSignUpPage from '@/views/LoginSignUpPage.vue'
import AccountPage from '@/views/AccountPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import EmailVerificationPage from '@/views/EmailVerificationPage.vue'
import CreateHousePage from '@/views/CreateHousePage.vue'
import CreateSessionPage from '@/views/CreateSessionPage.vue'


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
    component: HousePage,
    props: true
  },
  {
    path: '/house-page/:userId/create',
    name: 'CreateHousePage',
    component: CreateHousePage,
    props: true
  },
  {
    path: '/session-page/create/:currHouseId',
    name: 'CreateSessionPage',
    component: CreateSessionPage,
    props: true
  },
  {
    path: '/account/:accountActionType',
    name: 'LoginSignUpPage',
    component: LoginSignUpPage
  },
  {
    path: '/acccount/email-verified',
    name: 'EmailVerificationPage',
    component: EmailVerificationPage
  },

  {
    path: '/account/info',
    name: 'AccountPage',
    component: AccountPage,
    meta: {
        requiresAuth: true,
    }
  },
  {
      path: '/:pathMatch(.*)*',
      name: 'NotFoundPage',
      component: NotFoundPage,
  },


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


    const getCurrentUser = () => {
        return new Promise((reslove, reject) => {
            const removeListener = onAuthStateChanged(
                getAuth(),
                (user) => {
                    removeListener()
                    reslove(user)
                },
                reject
            )

        })


    }

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth )) {
        if(await getCurrentUser()) {
            next();
        } else {
            alert("Not sign in")
            next("/account/login")
        }

    } else {
        next()
    }

})

export default router
