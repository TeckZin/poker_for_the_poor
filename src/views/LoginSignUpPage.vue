<template>
    <div>
        <div v-if="accountActionType === 'login'">
            <LoginComponent> </LoginComponent>
        </div>
        <div v-else>
            <SignUpComponent> </SignUpComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { useRoute } from 'vue-router'
import LoginComponent from '../components/LoginComponent.vue'
import SignUpComponent from '../components/SignUpComponent.vue'

export default defineComponent({
  components: {
    LoginComponent,
    SignUpComponent,

  },
  name: 'LoginSignUpPage',
  setup() {
    // Component logic can be added here
    const route = useRoute();
    const accountActionType = ref(route.params.accountActionType as string)

    return {
        accountActionType

    }
  },
})
</script>

