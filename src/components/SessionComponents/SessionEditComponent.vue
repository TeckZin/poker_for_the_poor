<template>
  <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
    <div class="flex flex-row justify-between mt-3">
      <button class="text-[2.5vw] ml-4 text-button-text-color" @click="handleBackClick">
        back
      </button>
      <SignOutBarComponent class="mr-7" @is-logged-in="handleLoggedInChange" />
    </div>

    <div  class="w-full flex flex-row h-full">
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
              <tr v-for="(player, index) in session.players" :key="index">
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
          <!-- <button class="text-[1.5vw]" @click="testClick"> Test </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed, onMounted, watch } from 'vue'
import { collection, addDoc, getDoc, getFirestore, doc, updateDoc, arrayUnion,DocumentReference } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'
import { Session } from '@/models/SessionTypes'
import { Player, PlayerMember } from '@/models/PlayerTypes'

export default defineComponent({
  name: 'SessionEditComponent',
  components: {
    SignOutBarComponent,
  },
  props: {
    editFlag: {
        type: Boolean,
        required: true
    },
    sessionId: {
      type: String,
      required: false
    },
    houseId: {
      type: String,
      required: false

    }
  },
  setup(props) {
    const db = getFirestore()
    const router = useRouter()
    const auth = getAuth()

    const errorMessage = ref('')
    const buyInErrorMessage = ref('')

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
      hostUid: props.houseId ?? '',
      hostUidRef: null,
    })



    const infoLabelClass = "text-[2.5vw]"
    const infoInputClass = "text-[2vw] bg-[#69747C] pl-2 rounded-xl"
    const infoDivClass = "flex flex-col justify-between"
    const thClass = "text-left"
    const tdInputClass = "pt-3 pr-3"
    const playerInfoThClass = "bg-[#69747C] rounded-lg text-[1.3vw] w-full pl-1.5"
    const playerErrorMessages: Ref<string[]> = ref([])

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

    console.log(props.sessionId)

    const handleLoggedInChange = (isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        router.push({ name: "AccountPage" })
      }
    }

    const handleBackClick = () => {
      router.go(-1)
    }



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

    const validateSession = (): boolean => {
      errorMessage.value = ''
      buyInErrorMessage.value = ''
      playerErrorMessages.value = new Array(players.value.length).fill('')

      let isValid = true

      const totalBuyIn = players.value.reduce((sum, player) => sum + (player.buyIn || 0), 0)
      const totalBuyOut = players.value.reduce((sum, player) => sum + (player.buyOut || 0), 0)

      if (totalBuyIn !== totalBuyOut) {
        buyInErrorMessage.value = 'Total buy-in and buy-out amounts do not match'
      }

      if (totalBuyIn !== session.value?.totalBuyIn) {
        buyInErrorMessage.value = 'Total buy-in amounts do not match'
        isValid = false
      }

      if (totalBuyOut !== session.value?.totalBuyOut) {
        buyInErrorMessage.value = 'Total buy-out amounts do not match'
        isValid = false
      }

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
      if(!isValid) {
        return false
      }

      if(!session.value.name) {
        errorMessage.value = 'Session name need to be Fill'
        return false

      }

      if(!session.value.date) {
        errorMessage.value = 'Session date need to be Fill'
        return false

      }
      if(!session.value.bigBlind) {
        errorMessage.value = 'Session Big Blind need to be Fill'
        isValid = false
        return false

      }
      if(!session.value.smallBlind) {
        errorMessage.value = 'Session Small Blind need to be Fill'
        return false

      }

      return true
    }

    const submitEditClick = async () => {
      try {
          if (!props.sessionId) {
            return
          }
        session.value.sessionId = props.sessionId
        const sessionRef = doc(db, 'session_ids', props.sessionId)
        const sessionUpdate = {
          name: session.value.name,
          date: session.value.date,
          players: session.value.players,
          totalBuyIn: session.value.totalBuyIn,
          totalBuyOut: session.value.totalBuyOut,
          bigBlind: session.value.bigBlind,
          smallBlind: session.value.smallBlind,
          parentHouseId: session.value.parentHouseId,
          sessionId: session.value.sessionId,
          hostUid: session.value.hostUid
        }

        await updateDoc(sessionRef, sessionUpdate)
      } catch (error) {
        errorMessage.value = 'Failed to update session'
        console.error('Error updating session:', error)
      }



    }


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






    const submitCreateClick = async () => {

          session.value.players = [...players.value]
          session.value.parentHouseId = props.houseId ?? ''

          console.log(props.houseId)
          try {
            const docRef = await addDoc(collection(db, 'session_ids'), session.value)
            session.value.sessionId = docRef.id
            errorMessage.value = ''
            await updateValueForSubmit(docRef.id)
          } catch (error) {
            console.error('Error adding session:', error)
            errorMessage.value = 'Failed to submit session'
          }

    }


    const updateValueForSubmit = async (sessionId: string) => {
      try {
        if(!props.houseId) {
            return
        }
        console.log(props.houseId)
        const sessionDocRef = doc(db, 'session_ids', sessionId)
        const houseDocRef = doc(db, 'house_ids', props.houseId)
        const userDocRef = doc(db, 'users', currUser.value.uid)

        await updateDoc(userDocRef, {
          sessionsHosted: arrayUnion(sessionId),
          sessionsHostedRef: arrayUnion(sessionDocRef)
        })

        await updateDoc(sessionDocRef, {
            sessionsId: sessionId,
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



    const submitClick = async () => {
        session.value.players = players.value
        if(!validateSession()) {
            return
        }
        if(props.editFlag) {
            if(props.sessionId) {
               await submitEditClick()
            }
        } else {
            await submitCreateClick()
        }
        await updatePlayerMembers()
        router.go(-1)
    }


    const updatePlayerMember = async (playerRef: DocumentReference,
    sessionDocRef: DocumentReference) => {
           await updateDoc(playerRef, {
                   sessionsPlayedIds: arrayUnion(session.value.sessionId),
                   sessionsPlayedIdsRef: arrayUnion(sessionDocRef),
            })

    }





   const updatePlayerMembers = async () => {

        console.log('pass test 1')
        const playerList = session.value.players.filter((player) => player.member && player.uid);
        let playerMembers: PlayerMember[] = [];

        if (playerList.length) {
            try {
                const members = await Promise.all(
                    playerList.map(async (player) => {
                        if(!player.uid) {
                            return null
                        }
                        const playerRef = doc(db, 'users', player.uid);
                        const playerSnap = await getDoc(playerRef);

                        if (playerSnap.exists()) {
                            return playerSnap.data() as PlayerMember;
                        } else {
                            throw new Error(`UID ${player.uid} doesn't exist`);
                        }
                    })
                )
                playerMembers = members.filter((member): member is PlayerMember => member !== null);
                errorMessage.value = ''

            } catch (error) {

                return
            }
        }

        console.log('pass test 2')

        console.log(session.value)

        const sessionDocRef = doc(db, 'session_ids', session.value.sessionId)

        playerMembers.filter((player) => !player.sessionsPlayedIds.includes(session.value.sessionId)
        && !player.sessionsPlayedIdsRef.includes(sessionDocRef))



        console.log('pass test 3')


        if (playerMembers.length) {
            try {
                const members = await Promise.all(
                    playerMembers.map(async (player) => {
                        const playerRef = doc(db, 'users', player.uid);
                        await updatePlayerMember(playerRef, sessionDocRef)
                    })



                )


            } catch (error) {
                return
            }

        }
        console.log('pass test 4')

    };

    const testClick = async () => {
        // await updatePlayerMembers()


    }

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
                    if (user) {
                        currUser.value.uid = user.uid
                        if (!user.emailVerified) {
                            router.push({ name: "EmailVerificationPage"})

                        }
                    }

                })

      session.value.players = [...players.value]
    })




    watch(players, (newPlayers) => {
      newPlayers.forEach((player, index) => {
            playerErrorMessages.value[index] = "";
            newPlayers.some((player2, index2) => {
                if (player.username === player2.username && index !== index2 && player.username !== '') {
                    playerErrorMessages.value[index] = "can't have duplicated";
                    return true;
                }
                return false;
            });
        });

      session.value.players = [...newPlayers]


      const totalBuyIn = players.value.reduce((sum, player) => sum + (player.buyIn || 0), 0)
      const totalBuyOut = players.value.reduce((sum, player) => sum + (player.buyOut || 0), 0)
      session.value.totalBuyOut = totalBuyOut
      session.value.totalBuyIn = totalBuyIn




      if (session.value.totalBuyIn !== session.value.totalBuyOut) {
        buyInErrorMessage.value = 'buy-in and buy-out amounts do not match'
      } else {
        buyInErrorMessage.value = ''

      }




    }, { deep: true })


    watch(() => props.sessionId, async (newSessionId) => {
      if (!newSessionId) {
        session.value  = {
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
          hostUid: props.houseId ?? '',
          hostUidRef: null,
        }

        return
      }
      await fetchSessionInfo(newSessionId)
    }, { immediate: true })


    return {
        infoDivClass,
        infoLabelClass,
        infoInputClass,
        thClass,
        tdInputClass,
        playerInfoThClass,
        session,
        players,
        errorMessage,
        buyInErrorMessage,
        playerErrorMessages,
        handleLoggedInChange,
        handleBackClick,
        addPlayerClick,
        removePlayerClick,
        submitClick,
        testClick
    }


  }
})
</script>
