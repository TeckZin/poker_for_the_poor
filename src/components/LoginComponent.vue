<template>
    <div class="flex  items-center justify-center w-full h-screen">
        <div class="bg-[#494949] p-8 rounded-lg shadow-2xl ">
            <p class="text-2xl font-bold mb-6 text-gray-300 text-center">Sign In</p>
            <form class="space-y-4 " @submit.prevent="submitForm">
                <div class="relative">
                    <label :class="[labelClass]" > Email: </label>
                    <input :class="[inputClass]" placeholder="example@gmail.com" v-model="email" type="text"/>
                </div>
                <div>
                    <label :class="[labelClass]"> Password:  </label>
                    <input :class="[inputClass]" placeholder="password" v-model="password" type="password"/>
                </div>
                <p class="text-[1vw] text-red-600"> {{ errorMessage }}  </p>
                <button @click="() => {loginInClick()}" class="w-full bg-transparent border border-white text-white py-2 rounded-md hover:bg-button-text-color hover:text-black transition duration-300">
                    Login
                </button>
            </form>
            <div class="mt-2 flex flex-row w-full justify-between">
                <p> Need an account? </p>
                <button @click="() => {signUpClick()}" class="text-button-text-color"> Sign Up </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
  },
  name: 'AccountLoginComponent',
  emit: ['type-change'],
  setup(props, {emit}) {
    // Component logic can be added here
    const router = useRouter()

    const auth = getAuth();

    const user = ref<User | null>(null);
    const email = ref('');
    const password = ref('');


    const errorMessage = ref('')



  //  <!-- const inputClass = "text-[1vw] bg-[#69747C] pl-2 rounded-xl " -->
    const inputClass = "w-full border-b border-white bg-transparent text-white px-3 py-2 rounded pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
    const labelClass = "text-[1vw]"


    const loginInClick = async () => {

        if (!email.value || !password.value) {
            errorMessage.value = "Not all fill"
            return
        }
        signInWithEmailAndPassword(auth, email.value, password.value).then((data) => {
            user.value = data.user
            router.push({ name: 'AccountPage' })
        }).catch((err) => {
            errorMessage.value = err.message
        })

        return
    }

    const signUpClick = () => {
        emit('type-change', 'sign-up')
        return
    }



    return {
        inputClass,
        labelClass,
        loginInClick,
        signUpClick,
        email,
        password,
        errorMessage

    }
  },
})
</script>

