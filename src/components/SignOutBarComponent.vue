<template>
   <div class="font-bebas-neue">
      <div  class="text-[2vw] text-button-text-color">
          <div v-if="isLoggedIn">
              <div v-if="isLoggedIn">
                  <router-link to="/account/info"> Account </router-link>
                  <button @click="() => {signOutClick()}"> Sign Out </button>
              </div>
              <div v-else>
                  Not logged in
              </div>
          </div>
          <div v-else>
              <button @click="() => {accountClick('sign-up')}" class="mr-4">SIGN UP</button>
              <button @click="() => {accountClick('login')}" >LOGIN</button>
          </div>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {

  },
  name: 'AccountPage',
  setup(props, {emit}) {
    // Component logic can be added here

    const errorMessage = ref('')


    const router = useRouter()
    const isLoggedIn = ref(false)

    onMounted(() => {

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {

            if (user) {
                isLoggedIn.value = true
                emit('is-logged-in', isLoggedIn.value)
            } else {
                isLoggedIn.value = false
                emit('is-logged-in', isLoggedIn.value)
            }

        })
    })

    const auth = getAuth()



    const signOutClick = async () => {
        signOut(auth).then(() => {
            router.push({ name: 'HomePage' })
        }).catch((err) => {
            errorMessage.value = err.message
        })



    }

    const accountClick = (accType: string) => {
      router.push({ name: 'LoginSignUpPage', params: { accountActionType: accType } })
    }

    return {
        signOutClick,
        isLoggedIn,
        accountClick

    }
  },
})
</script>

