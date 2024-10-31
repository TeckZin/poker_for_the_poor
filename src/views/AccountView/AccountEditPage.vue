<template>
   <div class="font-bebas-neue flex flex-col ">

       <div class="flex flex-row justify-between mt-3">
               <button class="text-[2vw] ml-6 text-button-text-color" @click="handleBackClick">
                   back
               </button>
           <SignOutBarComponent
                   class="mr-7"
                   @is-logged-in="handleLoggedInChange"
                   > </SignOutBarComponent>
       </div>
       <div class="flex flex-row">

        <div :class="[containerDivClass]">
            <p class="text-[2vw]"> Account Info </p>
            <div :class="[divClass]">
                <p :class="[pClass]"> Username: </p>
                <input
                        v-model="user.username"
                        :class="[inputClass]"
                        placeholder="username"
                        type="text"
                        />
            </div>

            <div :class="[divClass]">
                <p :class="[pClass]"> Email: </p>
                 <input
                        v-model="user.email"
                        :class="[inputClass]"
                        placeholder="email"
                        type="text"
                        />
            </div>
            <div :class="[divClass]">
                <p :class="[pClass]"> UID: </p>
                <p :class="[pClass]"> {{ user.uid }} </p>
            </div>
            <div :class="[divClass]">
                <p :class="[pClass]"> # Hosted House Games: </p>
                <p :class="[pClass]"> {{ user.houseGamesHosted.length }} </p>
            </div>
            <div :class="[divClass]">
                <p :class="[pClass]"> # Hosted Sessions: </p>
                <p :class="[pClass]"> {{ user.sessionsHosted.length }} </p>
            </div>
            <div :class="[divClass]">
                <p :class="[pClass]"> # Games Played: </p>
                <p :class="[pClass]"> {{ user.sessionsPlayedIds.length }} </p>
            </div>
            <div :class="[divClass]">
                <p :class="[pClass]"> # Host Games Played: </p>
                <p :class="[pClass]"> {{ user.houseGamesPlayedIds.length }} </p>
            </div>
            <div :class="[divClass]">
                <p :class="[pClass]"> Total Profit: </p>
                <p :class="[pClass]"> {{ user.buyOut - user.buyIn }} </p>
            </div>
            <div class="flex flex-row justify-between">
                <button class="text-[2vw] text-button-text-color
                               px-6 py-3 button-custom-hover-class mt-3"
                        @click="handleSubmitClick"
                               > Submit </button>
                <button class="text-[2vw] text-button-text-color
                               px-6 py-3 button-custom-hover-class mt-3"
                        @click="handleResetClick"
                               > Reset </button>
            </div>
        </div>
        <div class="flex flex-col w-1/3">
            <div class="flex flex-row text-[2vw] justify-between">
                <p class=""> Graphics </p>
            </div>
        </div>
       </div>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, onUpdated } from 'vue'
import { getFirestore, collection, getDocs, doc, Firestore, getDoc, setDoc, DocumentReference,
DocumentSnapshot, QuerySnapshot} from "firebase/firestore";
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Player, PlayerMember, createEmptyPlayerMember } from '@/models/PlayerTypes'
import { useRouter } from 'vue-router'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'

export default defineComponent({
  components: {
    SignOutBarComponent

  },
  name: 'AccountEditPage',
  setup() {
    // Component logic can be added here
    const auth = getAuth()
    const db = getFirestore();
    const router = useRouter()

    const errorMessage = ref('')
    const userUid = ref('')
    const user: Ref<PlayerMember> = ref(createEmptyPlayerMember())


    const pClass = "text-[1.5vw]"
    const divClass = "flex flex-row justify-between"
    const containerDivClass = "w-1/3 mx-6"
    const inputClass = "bg-[#545454] rounded-lg text-[1.5vw] pl-3 border border-white w-2/3 "

    const handleBackClick = () => {
      router.go(-1)
    }

    const handleResetClick = () => {
        console.log('reset')
    }


    const handleSubmitClick = () => {
        console.log('submit')
    }

    const checkUserExists = async (uid: string, username: string): Promise<boolean>  => {
        const userDocRef = doc(db, 'users', uid)

        try {
            const userDocSnap: DocumentSnapshot = await getDoc(userDocRef)

            if (!userDocSnap.exists()) {
                return false
            }

            const currUser = userDocSnap.data() as PlayerMember
            return true

        } catch (error) {
            console.error('Error checking user existence:', error)
            return true
        }
    }


    const fetchCurrPlayer = async (uid: string) => {

        try {
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef)
            if(userSnap.exists()) {
                user.value = userSnap.data() as PlayerMember
                console.log(user.value)
            }
        } catch (error) {
            console.error(error)
        }
    }

     onMounted(() => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    userUid.value = user.uid
                    if (!user.emailVerified) {
                        router.push({ name: "EmailVerificationPage"})

                    } else {
                        fetchCurrPlayer(user.uid)
                    }
                }

            })
        })






    return {
        user,
        divClass,
        containerDivClass,
        pClass,
        inputClass,
        handleBackClick,
        handleResetClick,
        handleSubmitClick
    }
  },
})
</script>

