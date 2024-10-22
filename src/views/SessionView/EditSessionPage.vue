<template>
  <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
    <div class="flex flex-row justify-between mt-3">
      <button class="text-[2.5vw] ml-4 text-button-text-color" @click="handleBackClick">
        back
      </button>
      <SignOutBarComponent class="mr-7" @is-logged-in="handleLoggedInChange" />
    </div>

    <div v-if="session" class="w-full flex flex-row h-full">
      <!-- Left column with session info -->
      <div class="flex flex-col w-1/4 mr-[5vw]">
        <div class="overflow-y-auto flex-grow">
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for="name">Name: </label>
            <input :class="[infoInputClass]" v-model="session.name" type="text" placeholder="session name" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for="date">Date: </label>
            <input :class="[infoInputClass]" v-model="session.date" type="date" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for="bigBlind">Big Blind (BB): </label>
            <input :class="[infoInputClass]" v-model="session.bigBlind" type="number" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for="smallBlind">Small Blind (SB): </label>
            <input :class="[infoInputClass]" v-model="session.smallBlind" type="number" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for="totalBuyIn">Total Buy In: </label>
            <p class="text-[2vw]">{{ session.totalBuyIn }}</p>
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for="totalBuyOut">Total Buy Out: </label>
            <p class="text-[2vw]">{{ session.totalBuyOut }}</p>
          </div>
          <p class="text-red-500 text-[2vw]">{{ buyInErrorMessage }}</p>
        </div>
      </div>

      <!-- Right column with players table -->
      <div class="w-2/5 flex flex-col">
        <p class="text-red-500 text-[2vw]">{{ errorMessage }}</p>
        <div class="overflow-y-auto scrollbar-hide flex-grow">
          <table class="w-full border-collapse leading-normal">
            <thead class="text-[2vw] sticky top-0">
              <tr>
                <th class="w-1/3 text-left pb-3">Player</th>
                <th class="w-1/6 text-left pb-3">In</th>
                <th class="w-1/4 text-left pb-3">Out</th>
                <th class="w-1/12 text-left pb-3">UID</th>
                <th class="w-1/6 text-left pb-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) in players" :key="index">
                <td :class="[tdInputClass]">
                  <input
                    v-model="player.username"
                    :class="[playerInfoThClass]"
                    placeholder="Player Name"
                    type="text"
                  />
                  <p class="text-red-500">{{ playerErrorMessages[index] }}</p>
                </td>
                <td :class="[tdInputClass]">
                  <input
                    v-model.number="player.buyIn"
                    :class="[playerInfoThClass]"
                    placeholder="In"
                    type="number"
                  />
                </td>
                <td :class="[tdInputClass]">
                  <input
                    v-model.number="player.buyOut"
                    :class="[playerInfoThClass]"
                    placeholder="Out"
                    type="number"
                  />
                </td>
                <td :class="[tdInputClass]">
                  <input
                    v-model="player.member"
                    :class="[playerInfoThClass]"
                    placeholder="Member"
                    type="checkbox"
                  />
                </td>
                <td :class="[tdInputClass]">
                  <input
                    v-if="player.member"
                    v-model="player.uid"
                    :class="[playerInfoThClass]"
                    placeholder="UUID"
                    type="string"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-row justify-evenly">
          <button @click="removePlayerClick" class="mt-2 text-[1.5vw] text-button-text-color">
            Remove Player
          </button>
          <button @click="addPlayerClick" class="mt-2 text-[1.5vw] text-button-text-color">
            Add Player
          </button>
          <button @click="submitClick" class="mt-2 text-[1.5vw] text-button-text-color">
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed, onMounted, watch } from 'vue'
import { collection, addDoc, getDoc, getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'
import { Session } from '@/models/SessionTypes'
import { Player, PlayerMember } from '@/models/PlayerTypes'

export default defineComponent({
  name: 'EditSessionPage',
  components: {
    SignOutBarComponent,
  },
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const db = getFirestore()
    const router = useRouter()
    const auth = getAuth()

    const pageRouteName = ref('EditSessionPage')
    const isLoggedIn = ref(false)
    const session: Ref<Session | null> = ref(null)
    const players: Ref<Player[]> = ref([])
    const errorMessage = ref('')
    const buyInErrorMessage = ref('')
    const playerErrorMessages = ref<string[]>([])

    // Styling classes
    const infoLabelClass = "text-[2.5vw]"
    const infoInputClass = "text-[2vw] bg-[#69747C] pl-2 rounded-xl"
    const infoDivClass = "flex flex-col justify-between"
    const thClass = "text-left"
    const tdInputClass = "pt-3 pr-3"
    const playerInfoThClass = "bg-[#69747C] rounded-lg text-[1.3vw] w-full pl-1.5"

    // Handle add/remove players
    const addPlayerClick = () => {
        if (players.value.length >= 8) {
            errorMessage.value = "Too Many Players"
            return
        }
      errorMessage.value = ''
      players.value.push({
        username: '',
        buyIn: 0,
        buyOut: 0,
        member: false,
        uid: '',
        playerRef: null
      })
      playerErrorMessages.value.push('')
    }

    const removePlayerClick = () => {
      if (players.value.length >= 2) {
        players.value.pop()
        playerErrorMessages.value.pop()
      }
    }

    // Validate and submit changes
    const validateSession = (): boolean => {
      errorMessage.value = ''
      buyInErrorMessage.value = ''
      playerErrorMessages.value = new Array(players.value.length).fill('')

      let isValid = true

      // Validate total buy in/out calculations
      const totalBuyIn = players.value.reduce((sum, player) => sum + (player.buyIn || 0), 0)
      const totalBuyOut = players.value.reduce((sum, player) => sum + (player.buyOut || 0), 0)

      if (totalBuyIn !== session.value?.totalBuyIn) {
        buyInErrorMessage.value = 'Total buy-in amounts do not match'
        isValid = false
      }

      if (totalBuyOut !== session.value?.totalBuyOut) {
        buyInErrorMessage.value = 'Total buy-out amounts do not match'
        isValid = false
      }

      // Validate players
      players.value.forEach((player, index) => {
        if (!player.username) {
          playerErrorMessages.value[index] = 'Username required'
          isValid = false
        }
        if (player.member && !player.uid) {
          playerErrorMessages.value[index] = 'UID required for members'
          isValid = false
        }
      })

      return isValid
    }

    const submitClick = async () => {
      if (!validateSession()) {
        return
      }

      try {
        const sessionRef = doc(db, 'session_ids', props.sessionId)
        await updateDoc(sessionRef, {
          ...session.value,
          players: players.value
        })
        router.go(-1)
      } catch (error) {
        errorMessage.value = 'Failed to update session'
        console.error('Error updating session:', error)
      }
    }

    const handleLoggedInChange = (value: boolean) => {
      isLoggedIn.value = value
    }

    const handleBackClick = () => {
      router.go(-1)
    }

    // Fetch session data
    const fetchSessionInfo = async (newSessionId: string) => {
      try {
        const sessionRef = doc(db, 'session_ids', newSessionId)
        const sessionSnap = await getDoc(sessionRef)

        if (sessionSnap.exists()) {
          session.value = sessionSnap.data() as Session
          players.value = session.value.players
          playerErrorMessages.value = new Array(players.value.length).fill('')
        } else {
          router.go(-1)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
        router.go(-1)
      }
    }

    // Watch for sessionId changes
    watch(() => props.sessionId, async (newSessionId) => {
      if (!newSessionId) {
        session.value = null
        return
      }
      await fetchSessionInfo(newSessionId)
    }, { immediate: true })

    return {
      handleBackClick,
      handleLoggedInChange,
      session,
      players,
      errorMessage,
      buyInErrorMessage,
      playerErrorMessages,
      addPlayerClick,
      removePlayerClick,
      submitClick,
      infoDivClass,
      infoLabelClass,
      infoInputClass,
      thClass,
      tdInputClass,
      playerInfoThClass,
    }
  }
})
</script>
