<template>
    <div>
        <div v-if="accountActionType === 'login'">
            <LoginComponent
             @type-change="handleAccChange"
            :pageRouteName="pageRouteName"
            > </LoginComponent>
        </div>
        <div v-else>
            <SignUpComponent
            @type-change="handleAccChange"
            :pageRouteName="pageRouteName"
            > </SignUpComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { useRoute } from 'vue-router'
import LoginComponent from '@/components/AccountComponents/LoginComponent.vue'
import SignUpComponent from '@/components/AccountComponents/SignUpComponent.vue'

export default defineComponent({
  components: {
    LoginComponent,
    SignUpComponent,

  },
  name: 'LoginSignUpPage',
  setup(props) {
    // Component logic can be added here
    const route = useRoute();
    const accountActionType = ref(route.params.accountActionType as string)
    // let pageRouteName = ref(route.params.pageRouteName as string)


    const pageRouteName = ref("AccountPage")

    const handleAccChange = (value: string) => {
        console.log(value)
        accountActionType.value = value
    }

    return {
        accountActionType,
        handleAccChange,
        pageRouteName

    }
  },
})
</script>

