<template>
   <div class="flex flex-col justify-evenly w-full h-screen font-bebas-neue p-6">
    <div class="flex flex-row justify-between items-start w-full">
      <p class="text-[13vw] leading-none mt-[-0.1em]">POKER FOR THE POOR</p>
      <div class="text-[2vw] text-button-text-color">
        <button @click="() => {accountClick('sign-up')}" class="mr-4">SIGN UP</button>
        <button @click="() => {accountClick('login')}" >LOGIN</button>
      </div>
    </div>
      <InputComponent> </InputComponent>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InputComponent from '../components/InputComponent.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
      InputComponent,

  },
  name: 'HomePage',
  setup() {
    // Component logic can be added here
    const router = useRouter()

    const accountClick = (accType: string) => {
      router.push({ name: 'LoginSignUpPage', params: { accountActionType: accType } })
    }

    return {
      accountClick
    }
  },
})
</script>

