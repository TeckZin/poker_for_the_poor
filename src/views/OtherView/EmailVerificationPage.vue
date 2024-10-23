
<template>
   <div class="font-bebas-neue ">
       <div v-if="!emailVerified">
           Email Send Verified Email
        </div>

   </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated } from 'vue'
import { getFirestore, collection, getDocs, doc, Firestore, getDoc, setDoc, DocumentReference } from "firebase/firestore";
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Player, PlayerMember } from '@/models/PlayerTypes'
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
    const db = getFirestore();
    const router = useRouter()
    const errorMessage = ref('')


    const checkUserExists = async (uid: string): Promise<boolean>  => {
        const userDocRef = doc(db,'users', uid)
        const userDocSnap = await getDoc(userDocRef)
        return userDocSnap.exists()

    }

    const addUserToFirestore = (userPlayer: PlayerMember) => {
        const userRef = doc(db, 'users', userPlayer.uid)

        setDoc(userRef, userPlayer).then((data) => {
            errorMessage.value = ''

        }).catch((err) => {
            errorMessage.value = err.message
        })


    }

    onMounted(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currUser.value = user
                emailVerified.value = user.emailVerified
                if (user.emailVerified) {

                     const flag = await checkUserExists(user.uid)
                     if (!flag) {
                        const userPlayer: PlayerMember = {
                            username: '',
                            buyIn: 0,
                            buyOut: 0,
                            uid: user.uid?.toString() || '',
                            email: user.email?.toString() || '',
                            houseGamesPlayedIds: [] as string[],
                            sessionsPlayedIds: [] as string[],
                            houseGamesHosted: [] as string[],
                            sessionsHosted: [] as string[],
                            houseGamesPlayedIdsRef: [] as DocumentReference[],
                            sessionsPlayedIdsRef: [] as DocumentReference[],
                            houseGamesHostedRef: [] as DocumentReference[],
                            sessionsHostedRef: [] as DocumentReference[]
                        }

                        addUserToFirestore(userPlayer)

                     }
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

