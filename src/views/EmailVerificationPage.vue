
<template>
   <div class="font-bebas-neue ">
       <div v-if="!emailVerified">
           Email Send Verified Email
        </div>

   </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue'
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {

  },
  name: 'EmailVerificationPage',
  setup() {
    // Component logic can be added here
    const emailVerified = ref(false)
    const currUser = ref<User | null>(null)
    const auth = getAuth()
    const router = useRouter()
    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currUser.value = user
                emailVerified.value = user.emailVerified
                if (user.emailVerified) {
                     router.push({ name: "AccountPage" })

                }
            }

        })
    })




    return {
        emailVerified
    }
  },
})
</script>

