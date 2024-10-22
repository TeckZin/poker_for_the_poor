<template>
  <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
    <div class="flex flex-row justify-between mt-3">
      <p class="text-[3vw]">House Id: {{currHouseId}}</p>
      <SignOutBarComponent
        class="mr-7"
        @is-logged-in="handleLoggedInChange"
        :pageRouteName="pageRouteName"
      />
    </div>
    <div class="w-full flex flex-row h-[70vh]">
      <div class="flex flex-col w-1/4 mr-[5vw]">
        <div class="overflow-y-auto flex-grow">
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='date'>Date: </label>
            <input :class="[infoInputClass]" v-model="session.date" type="date" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='totalBuyIn'>Total Buy In: </label>
            <input :class="[infoInputClass]" v-model="session.totalBuyIn" type="number" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='totalBuyOut'>Total Buy Out: </label>
            <input :class="[infoInputClass]" v-model="session.totalBuyOut" type="number" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='bigBlind'>Big Blind (BB): </label>
            <input :class="[infoInputClass]" v-model="session.bigBlind" type="number" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='smallBlind'>Small Blind (SB): </label>
            <input :class="[infoInputClass]" v-model="session.smallBlind" type="number" />
          </div>
        </div>
      </div>
      <div class="w-2/5 flex flex-col">
        <p class="text-red-500 text-[2vw]">{{errorMessage}}</p>
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
                  <input v-model="player.username" :class="[playerInfoThClass]" placeholder="Player Name" type="text"/>
                </td>
                <td :class="[tdInputClass]">
                  <input v-model="player.buyIn" :class="[playerInfoThClass]" placeholder="In" type="number"/>
                </td>
                <td :class="[tdInputClass]">
                  <input v-model="player.buyOut" :class="[playerInfoThClass]" placeholder="Out" type="number"/>
                </td>
                <td :class="[tdInputClass]">
                  <input v-model="player.member" :class="[playerInfoThClass]" placeholder="Member" type="checkbox"/>
                </td>
                <td :class="[tdInputClass]">
                  <input v-if="player.member" v-model="player.uid" :class="[playerInfoThClass]" placeholder="UUID" type="string"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-row justify-evenly">
          <button @click="removePlayerClick" class="mt-2 text-[1.5vw] text-button-text-color">Remove Player</button>
          <button @click="addPlayerClick" class="mt-2 text-[1.5vw] text-button-text-color">Add Player</button>
          <button @click="submitClick" class="mt-2 text-[1.5vw] text-button-text-color">SUBMIT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed, onMounted, watch } from 'vue'
import { collection, addDoc, getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import SignOutBarComponent from '../components/SignOutBarComponent.vue'
import { Session } from '../models/sessionTypes'
import { Player, PlayerMember } from '../models/playerTypes'

export default defineComponent({
  name: 'CreateSessionPage',
  components: {
    SignOutBarComponent,
  },
  props: {
    currHouseId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const db = getFirestore()
    const router = useRouter()
    const auth = getAuth()

    // Add the missing pageRouteName
    const pageRouteName = ref('CreateSessionPage')

    const houseId = ref(props.currHouseId)
    const errorMessage = ref('')
    const session: Ref<Session> = ref({
      sessionId: '',
      name: '',
      date: '',
      players: [],
      totalBuyIn: 0,
      totalBuyOut: 0,
      bigBlind: 0,
      smallBlind: 0,
      parentHouseId: '',
      parentHouseIdRef: null,
      hostUid: houseId.value,
      hostUidRef: null,
    })

    const amountOfPlayers: Ref<number> = ref(2)
    const players: Ref<Player[]> = ref(
      Array(amountOfPlayers.value).fill(null).map(() => ({
        username: '',
        buyIn: 0,
        buyOut: 0,
        member: false,
        uid: '',
        playerRef: null
      }))
    )

    // Add the missing handleLoggedInChange method
    const handleLoggedInChange = (isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        router.push({ name: "AccountPage" })
      }
    }

    const infoLabelClass = "text-[2.5vw]"
    const infoInputClass = "text-[2vw] bg-[#69747C] pl-2 rounded-xl"
    const infoDivClass = "flex flex-col justify-between"
    const thClass = "text-left"
    const tdInputClass = "pt-3 pr-3"
    const playerInfoThClass = "bg-[#69747C] rounded-lg text-[1.3vw] w-full pl-1.5"

    const currUser = ref<PlayerMember>({
      username: '',
      email: '',
      buyIn: 0,
      buyOut: 0,
      uid: '',
      houseGamesPlayedIds: [],
      sessionsPlayedIds: [],
      houseGamesHosted: [],
      sessionsHosted: [],
      houseGamesPlayedIdsRef: [],
      sessionsPlayedIdsRef: [],
      houseGamesHostedRef: [],
      sessionsHostedRef: []
    })

    const removePlayerClick = () => {
      if (amountOfPlayers.value <= 2) {
        errorMessage.value = "Can't remove more players"
      } else {
        amountOfPlayers.value--
        players.value.pop()
        errorMessage.value = ""
      }
    }

    const addPlayerClick = () => {
      amountOfPlayers.value++
      players.value.push({
        username: '',
        buyIn: 0,
        buyOut: 0,
        member: false,
        uid: '',
        playerRef: null
      })
    }

    const updateValueForSubmit = async (sessionId: string) => {
      try {
        const sessionDocRef = doc(db, 'session_ids', sessionId)
        const userDocRef = doc(db, 'users', currUser.value.uid)

        await updateDoc(userDocRef, {
          sessionsHosted: arrayUnion(sessionId),
          sessionsHostedRef: arrayUnion(sessionDocRef)
        })
      } catch (error) {
        console.error('Error updating values:', error)
        errorMessage.value = 'Failed to update session details'
      }
    }

    const addSessionToDB = async (newSession: Session) => {
      try {
        const docRef = await addDoc(collection(db, 'session_ids'), newSession)
        newSession.sessionId = docRef.id
        errorMessage.value = ''
        await updateValueForSubmit(docRef.id)
        router.push({ name: 'SessionDetails', params: { sessionId: docRef.id } })
      } catch (error) {
        console.error('Error adding session:', error)
        errorMessage.value = 'Failed to submit session'
      }
    }

    const submitClick = () => {
      if (!session.value.date ||
          session.value.totalBuyIn === 0 ||
          session.value.totalBuyOut === 0 ||
          session.value.bigBlind === 0 ||
          session.value.smallBlind === 0) {
        errorMessage.value = "Please fill in all session details"
        return
      }

      for (const player of players.value) {
        if (!player.member) {
          player.uid = null
        }
        if (!player.username || player.buyIn === 0 || (player.member && !player.uid)) {
          errorMessage.value = "Please fill in all player details"
          return
        }
      }

      session.value.players = [...players.value]
      session.value.parentHouseId = props.currHouseId
      addSessionToDB(session.value)
    }

    const fetchPlayerMember = async (uid: string) => {
      try {
        const userDocRef = doc(db, 'users', uid)
        // Add your fetch logic here
      } catch (error) {
        console.error('Error fetching player:', error)
      }
    }

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user?.uid) {
          currUser.value.uid = user.uid
          fetchPlayerMember(user.uid)
        } else {
          router.push({ name: "AccountPage" })
        }
      })
    })

    watch(players, (newPlayers) => {
      session.value.players = [...newPlayers]
    }, { deep: true })

    return {
      session,
      amountOfPlayers,
      infoInputClass,
      infoLabelClass,
      infoDivClass,
      thClass,
      tdInputClass,
      playerInfoThClass,
      addPlayerClick,
      removePlayerClick,
      submitClick,
      errorMessage,
      players,
      houseId,
      handleLoggedInChange,
      pageRouteName // Make sure to return the pageRouteName
    }
  }
})
</script>
