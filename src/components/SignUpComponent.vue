
<template>
    <div class="flex  items-center justify-center w-full h-screen">
        <div class="bg-[#494949] p-8 rounded-lg shadow-2xl ">
            <p class="text-2xl font-bold mb-6 text-gray-300 text-center"> Sign Up</p>
            <form class="space-y-4 " @submit.prevent="submitForm">
                <div class="relative">
                    <label :class="[labelClass]" > Email: </label>
                    <input
                    required
                    :class="[inputClass]" placeholder="example@gmail.com" v-model="email" type="text"/>
                </div>
                <div>
                    <label :class="[labelClass]"> Password:  </label>
                    <input
                     required
                    :class="[inputClass]" placeholder="password" v-model="password" type="password"/>
                </div>
                <div>
                    <label :class="[labelClass]"> Confirm Password:  </label>
                    <input required
                    :class="[inputClass]"
                    placeholder="confirm password" v-model="confirmPassword" type="password"/>
                </div>
                <p class="text-[1vw] text-red-600"> {{ errorMessage }}  </p>

                <button
                    @click="() => {signUpClick()}"
                    class="w-full bg-transparent border border-white
                    text-white py-2 rounded-md hover:bg-button-text-color
                    hover:text-black transition duration-300">
                    Sign Up
                </button>
            </form>
            <div class="mt-2 flex flex-row w-full justify-between">
                <p> Already have an account? </p>
                <button @click="() => {loginInClick()}" class="text-button-text-color"> Sign In </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, User, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, Firestore } from "firebase/firestore";


export default defineComponent({
  components: {

  },
  props: {
    pageRouteName: {
        type: String,
        required: true
    }
  },
  name: 'AccountSignUpComponent',
  setup(props, {emit}) {
    // Component logic can be added here

    const router = useRouter()
    const auth = getAuth();


    const user = ref<User | null>(null);
    const email = ref('');
    const errorMessage = ref('')
    const password = ref('');
    const confirmPassword = ref('');
    const emailVerfied = ref(false)

    const inputClass = "w-full border-b border-white bg-transparent text-white px-3 py-2 rounded pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
    const labelClass = "text-[1vw]"

    const db = getFirestore()


    const currUser = ref<User | null>(null)
    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currUser.value = user
                if (!user.emailVerified) {
                    router.push({ name: "EmailVerificationPage"})

                } else {
                    router.push({ name: props.pageRouteName })

                }

            }

        })
    })



    const signUpClick = async () => {
        if (!email.value || !password.value || !confirmPassword.value) {
            errorMessage.value = "Not all fill"
            return
        } else if (password.value !== confirmPassword.value) {
            errorMessage.value = "Password don't match"
            return
        }

        createUserWithEmailAndPassword(auth, email.value, password.value).then((data) => {
            user.value = data.user;
            sendVerficationEmail(data.user)


            router.push({ name: "EmailVerificationPage"})
        }).catch((err) => {
            // implement error code here
            switch(err.code) {
                case 'auth/invalid-email':
                  errorMessage.value = 'Invalid email address. Please check and try again.';
                  break;
                case 'auth/user-disabled':
                  errorMessage.value = 'This account has been disabled. Please contact support.';
                  break;
                case 'auth/operation-not-allowed':
                  errorMessage.value = 'This operation is not allowed. Please contact support.';
                  break;
                case 'auth/email-already-in-use':
                  errorMessage.value = 'An account with this email already exists. Please sign in.'
                  break;
                case 'auth/weak-password':
                  errorMessage.value = 'Password is too weak. Please choose a stronger password.';
                  break;
                default:
                  errorMessage.value = 'An unexpected error occurred. Please try again.';
                  break;
            }

        });




    }


    const sendVerficationEmail = (user: User) => {
        sendEmailVerification(user).then(() => {
            router.push({ name: "EmailVerificationPage"})

        }).catch((err) => {
            errorMessage.value = err.message

        })



    }


    const loginInClick = () => {
        emit('type-change', 'login')
        return
    }


    return {
        inputClass,
        labelClass,
        signUpClick,
        loginInClick,
        email,
        password,
        confirmPassword,
        errorMessage


    }
  },
})
</script>

