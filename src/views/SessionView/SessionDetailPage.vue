<template>
   <div class="font-bebas-neue ml-5">
    <div class="flex flex-row justify-between mt-3">
      <button class="text-[2.5vw]  text-button-text-color" @click="handleBackClick">
        back
      </button>
      <SignOutBarComponent class="mr-7" @is-logged-in="handleLoggedInChange" />
    </div>
    <div class="flex flex-row justify-evenly" v-if="session">
        <div class="text-[2vw] w-1/4">
            <p>session id: {{ session.sessionId }}</p>
            <p>session name: {{ session.name }}</p>
            <p>session date: {{ session.date }}</p>

        </div>

          <table class="table-auto w-1/4">
            <thead class="text-[2vw]">
              <tr>
                <th :class="[thClass]">Player</th>
                <th :class="[thClass]">In</th>
                <th :class="[thClass]">Out</th>
                <th :class="[thClass]">Profit</th>
              </tr>
            </thead>
            <tbody class="text-[1.5vw]">
              <tr v-for="(player, index) in session.players" :key="index">

                <td>{{ player.username }}</td>
                <td>{{ player.buyIn }}</td>
                <td>{{ player.buyOut }}</td>
                <td>{{ player.buyOut - player.buyIn }}</td>
              </tr>
            </tbody>
          </table>


          <div class="w-1/2">



          </div>

    </div>

   </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, onUpdated, PropType, watch } from 'vue'
import { getFirestore, collection, getDocs, doc, Firestore, getDoc, setDoc, DocumentReference } from "firebase/firestore";
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Player, PlayerMember } from '@/models/PlayerTypes';
import { Session } from '@/models/SessionTypes';
import { useRouter } from 'vue-router';
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'

export default defineComponent({
  components: {
    SignOutBarComponent,

  },

  props: {
    sessionId: {
        type: String,
        required: true

    }

  },
  name: 'SessionDetailPage',
  setup(props) {
    // Component logic can be added here
    const auth = getAuth()
    const db = getFirestore();
    const router = useRouter()


    const session: Ref<Session | null> = ref(null)

    const isLoggedIn = ref(false)


    const thClass = "text-left"


    const handleLoggedInChange = (value: boolean) => {
      isLoggedIn.value = value
    }

    const handleBackClick = () => {
      router.go(-1)
    }

    const fetchSessionInfo = async (newSessionId: string) => {
      try {
        const sessionRef = doc(db, 'session_ids', newSessionId)
        const sessionSnap = await getDoc(sessionRef)

        if (sessionSnap.exists()) {
          session.value = sessionSnap.data() as Session
        } else {
          alert("Error fetching session")
          router.go(-1)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
        alert("Error fetching session")
        router.go(-1)
      }
    }

    watch(() => props.sessionId, async (newSessionId) =>{
        if(!newSessionId) {
            session.value = null
            return
        }
        await fetchSessionInfo(newSessionId)

    }, { immediate: true})

    return {
        handleBackClick,
        handleLoggedInChange,
        thClass,
        session
    }
  },
})
</script>

