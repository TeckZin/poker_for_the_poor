<template>
  <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
    <div class="flex flex-row justify-between mt-3">
      <button class="text-[2.5vw] text-button-text-color" @click="handleBackClick">
        back
      </button>
      <SignOutBarComponent
        class="mr-7"
        @is-logged-in="handleLoggedInChange"
      />
    </div>
    <p class="text-[3vw]">House Id: {{currHouseId}}</p>
    <div class="w-full flex flex-row h-full">
      <div class="flex flex-col w-1/4 mr-[5vw]">
        <div class="overflow-y-auto flex-grow">
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='name'>Name: </label>
            <input :class="[infoInputClass]" v-model="session.name" type="text" placeholder="session name" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='date'>Date: </label>
            <input :class="[infoInputClass]" v-model="session.date" type="date" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='bigBlind'>Big Blind (BB): </label>
            <input :class="[infoInputClass]" v-model="session.bigBlind" type="number" />
          </div>
          <div :class="[infoDivClass]">
            <label :class="[infoLabelClass]" for='smallBlind'>Small Blind (SB): </label>
            <input :class="[infoInputClass]" v-model="session.smallBlind" type="number" />
          </div>
          <div :class="[infoDivClass]">
              <label :class="[infoLabelClass]" for='totalBuyIn'>Total Buy In: </label>
              <p class="text-[2vw]"> {{ session.totalBuyIn }} </p>
              <!-- <input :class="[infoInputClass]" v-model="session.totalBuyIn" type="number" /> -->
          </div>
          <div :class="[infoDivClass]">
              <label :class="[infoLabelClass]" for='totalBuyOut'>Total Buy Out: </label>
              <p class="text-[2vw]"> {{ session.totalBuyOut }} </p>
              <!-- <input :class="[infoInputClass]" v-model="session.totalBuyOut" type="number" /> -->
          </div>
          <p class="text-red-500 text-[2vw]"> {{buyInErrorMessage}}</p>
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
                  <p class="text-red-500"> {{ playerErrorMessage[index]}} </p>
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
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'
import { Session } from '@/models/SessionTypes'
import { Player, PlayerMember } from '@/models/PlayerTypes'

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
    const buyInErrorMessage = ref('')
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

    const handleBackClick = () => {
      router.go(-1)
    }

    const infoLabelClass = "text-[2.5vw]"
    const infoInputClass = "text-[2vw] bg-[#69747C] pl-2 rounded-xl"
    const infoDivClass = "flex flex-col justify-between"
    const thClass = "text-left"
    const tdInputClass = "pt-3 pr-3"
    const playerInfoThClass = "bg-[#69747C] rounded-lg text-[1.3vw] w-full pl-1.5"
    const playerErrorMessage: Ref<string[]> = ref([])

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
        if(players.value.length >= 8) {
            errorMessage.value = "Too Many Players"
            return
        }
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
        const houseDocRef = doc(db, 'house_ids', props.currHouseId)
        const userDocRef = doc(db, 'users', currUser.value.uid)

        await updateDoc(userDocRef, {
          sessionsHosted: arrayUnion(sessionId),
          sessionsHostedRef: arrayUnion(sessionDocRef)
        })

        await updateDoc(sessionDocRef, {
            sessionId: sessionId
        })

        await updateDoc(houseDocRef, {
            sessionsIds: arrayUnion(sessionId),
            sessionsIdsRef: arrayUnion(sessionDocRef),
        })

      } catch (error) {
        console.error('Error updating values:', error)
        errorMessage.value = 'Failed to update session details'
      }
    }


    const updateAllPlayerMembers = async (players: Player[]) => {
        console.log(players)


    }

    const addSessionToDB = async (newSession: Session) => {
      try {
        const docRef = await addDoc(collection(db, 'session_ids'), newSession)
        newSession.sessionId = docRef.id
        errorMessage.value = ''
        await updateValueForSubmit(docRef.id)
      } catch (error) {
        console.error('Error adding session:', error)
        errorMessage.value = 'Failed to submit session'
      }
    }

    const submitClick = async () => {
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
      await addSessionToDB(session.value)
      router.push({ name: 'HousePage', params: {houseId: props.currHouseId}})
    }

    const fetchPlayerMember = async (uid: string) => {
      try {
        const userDocRef = doc(db, 'users', uid)
        // more work here
      } catch (error) {
        console.error('Error fetching player:', error)
      }
    }


    const updateBuyInBuyOut = (newPlayers: Player[]) => {
      let buyInSum = 0
      let buyOutSum = 0
      for( const player of newPlayers ){
        buyInSum += player.buyIn
        buyOutSum += player.buyOut
      }

      session.value.totalBuyIn = buyInSum
      session.value.totalBuyOut = buyOutSum
      if(buyInSum !== buyOutSum) {
        buyInErrorMessage.value = "Buy In and Buy Out don't match"

      } else {
        buyInErrorMessage.value = ''

      }
    }


    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user?.uid) {
          currUser.value.uid = user.uid
          fetchPlayerMember(user.uid)
          updateBuyInBuyOut(players.value)
        } else {
          router.push({ name: "AccountPage" })
        }
      })
    })

    watch(players, (newPlayers) => {
      newPlayers.forEach((player, index) => {
            playerErrorMessage.value[index] = "";
            newPlayers.some((player2, index2) => {
                if (player.username === player2.username && index !== index2 && player.username !== '') {
                    playerErrorMessage.value[index] = "can't have duplicated";
                    return true;
                }
                return false;
            });
        });


      session.value.players = [...newPlayers]
      updateBuyInBuyOut(newPlayers)
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
      pageRouteName,
      playerErrorMessage,
      buyInErrorMessage,
      handleBackClick
    }
  }
})
</script>
