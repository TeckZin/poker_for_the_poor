import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomePage from '@/views/HomeView/HomePage.vue'
import HousePage from '@/views/HouseView/HousePage.vue'
import LoginSignUpPage from '@/views/AccountView/LoginSignUpPage.vue'
import AccountPage from '@/views/AccountView/AccountPage.vue'
import NotFoundPage from '@/views/OtherView/NotFoundPage.vue'
import EmailVerificationPage from '@/views/OtherView/EmailVerificationPage.vue'
import CreateHousePage from '@/views/HouseView/CreateHousePage.vue'
import CreateSessionPage from '@/views/SessionView/CreateSessionPage.vue'
import EditSessionPage from '@/views/SessionView/EditSessionPage.vue'
import SessionDetailPage from '@/views/SessionView/SessionDetailPage.vue'
import AccountEditPage from '@/views/AccountView/AccountEditPage.vue'


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
    path: '/house-page/create',
    name: 'CreateHousePage',
    component: CreateHousePage,
    props: true,
    meta: {
        requiresAuth: true,
    }
  },
  {
    path: '/session-page/create/:currHouseId',
    name: 'CreateSessionPage',
    component: CreateSessionPage,
    props: true,
    meta: {
        requiresAuth: true,
    }
  },
  {
    path: '/session-page/view/:sessionId',
    name: 'SessionDetailPage',
    component: SessionDetailPage,
    props: true
  },
  {
    path: '/session-page/edit/:sessionId',
    name: 'EditSessionPage',
    component: EditSessionPage,
    props: true,
    meta: {
        requiresAuth: true,
    }
  },
  {
    path: '/account/:accountActionType',
    name: 'LoginSignUpPage',
    component: LoginSignUpPage
  },
  {
    path: '/acccount/email-verified',
    name: 'EmailVerificationPage',
    component: EmailVerificationPage,
    meta: {
        requiresAuth: true,
    }
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
    path: '/account/info/edit',
    name: 'AccountEditPage',
    component: AccountEditPage,
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
