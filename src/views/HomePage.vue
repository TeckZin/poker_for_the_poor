<template>
   <div class="flex flex-col justify-evenly w-full h-screen font-bebas-neue p-6">
    <div class="flex flex-row justify-between items-start w-full">
      <p class="text-[13vw] leading-none mt-[-0.1em]">POKER FOR THE POOR</p>
      <div  class="text-[2vw] text-button-text-color">
          <SignOutBarComponent
                  @is-logged-in="handleLoggedInChnage"
                  :pageRouteName="AccountPage"
                  > </SignOutBarComponent>
      </div>
    </div>
      <InputComponent> </InputComponent>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue'
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router'
import InputComponent from '../components/InputComponent.vue'
import SignOutBarComponent from '../components/SignOutBarComponent.vue'

export default defineComponent({
  components: {
      InputComponent,
      SignOutBarComponent,

  },
  name: 'HomePage',
  setup() {
    // Component logic can be added here
    const router = useRouter()
    const isLoggedIn = ref(true)
    const currUser = ref<User | null>(null)
    const auth = getAuth();

    const handleLoggedInChnage = (value: boolean) => {
        isLoggedIn.value = value
    }

    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currUser.value = user
            }

        })
    })



    const accountClick = (accType: string) => {
      router.push({ name: 'LoginSignUpPage', params: { accountActionType: accType } })
    }


    return {
      accountClick,
      handleLoggedInChnage,
      isLoggedIn,
      currUser
    }
  },
})
</script>

