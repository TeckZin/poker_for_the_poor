<template>
  <div class="flex flex-col ml-10 justify-top  font-bebas-neue w-full">
      <div class="flex  mt-4 flex-row justify-between">
          <p class="text-[2vw]"> House Id: {{ houseId }} </p>
          <SignOutBarComponent
            class="mr-7"
            @is-logged-in="handleLoggedInChnage"
            :pageRouteName="HousePage"
          > </SignOutBarComponent>
      </div>
      <div class="flex flex-row">
          <div :class="newSessionFlag ? 'w-full' : 'w-1/4'">
              <div>
                  <p class="text-[4vw]"> Sessions </p>
                  <div v-if="!newSessionFlag && isLoggedIn">
                      <button @click="onCreateClick" class="text-[2vw] text-[#FCF0CC]" > Create New Session </button>
                  </div>
                  <div v-if="newSessionFlag && isLoggedIn">
                      <button @click="onCreateBackClick" class="text-[2vw] text-[#FCF0CC]" >BACK</button>
                      <div class="">
                          <CreateSessionComponent> </CreateSessionComponent>

                      </div>
                  </div>
                  <div v-else>
                  <table class="w-full table-auto">
                      <thead class="text-[2vw] w-full">
                          <tr>
                              <th :class="[thClass]"
                             >Date</th>
                              <th :class="[thClass]"
                             >Name</th>
                              <th :class="[thClass]"
                             ><button> View </button></th>
                          </tr>
                      </thead>
                      <tbody class="text-[1.5vw] w-full">
                          <tr v-for="session in sessions" :key="session.sessionId">
                              <td>{{ session.date }}</td>
                              <td>{{ session.name }}</td>
                              <td class='text-[#FCF0CC]'> <button @click="() => viewMoreClick(session) ">VIEW MORE</button></td>
                          </tr>
                      </tbody>
                  </table>
                  </div>
              </div>
          </div>
          <div v-if="!newSessionFlag" class="w-3/4 h-full">
              <SessionDetailComponent :session="selectedSession" :isLoggedIn="isLoggedIn"> </SessionDetailComponent>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute } from 'vue-router'
import { Session, Sessions} from '../models/sessionTypes'
import { House } from '../models/houseTypes'
import { Player } from '../models/playerTypes'
import SessionDetailComponent from '../components/SessionDetailComponent.vue'
import CreateSessionComponent from '../components/CreateSessionComponent.vue'
import SignOutBarComponent from '../components/SignOutBarComponent.vue'


export default defineComponent({
    components: {
        SessionDetailComponent,
        CreateSessionComponent,
        SignOutBarComponent,
    },
    name: 'HousePage',
    data() {
        return {
            thClass: "text-left",

        }

    },
    methods: {
        viewMoreClick(session: Session):void {
            this.selectedSession = session
        },
         onCreateClick() {
            this.newSessionFlag = true

        },
        onCreateBackClick() {
            this.newSessionFlag = false

        }


    },
     setup() {
        const route = useRoute();
        const db = getFirestore();
        const sessions = ref<Session[]>([]);
        const houseId = ref(route.params.houseId as string);
        const selectedSession: Ref<Session | null> = ref(null);
        const newSessionFlag = ref(false);
        const errorMessage = ref('')

        const isLoggedIn = ref(true)


        const currentHouse: Ref<House | null>= ref(null)


        const fetchHouseSessions = async (db: Firestore, houseId: string) => {
            const houseIdDocRef = doc(db, 'house_ids', houseId)
            getDoc(houseIdDocRef).then((rawData) => {

                if (rawData.exists()) {
                    const data = rawData.data();
                    currentHouse.value = {
                        hostUid: data.hostUid ?? '',
                        sessionsIds: data.sessions ?? [],
                        totalPlayers: data.totalPlayers ?? 0,
                        totalBuyIn: data.totalBuyIn ?? 0
                    };
                    console.log(currentHouse.value);
                    return fetchSessions(db, data.sessions)
                } else {
                    console.log('No such document!');
                    currentHouse.value = null;
                }


            }).catch((err) => {
                errorMessage.value = err.message


            })

        };

        const fetchSessions = async (db: Firestore, sessionsIds: string[]) => {
            console.log('here')
            for (const sessionId of sessionsIds) {
                const sessionIdsDocRef = doc(db, 'session_ids', sessionId)
                getDoc(sessionIdsDocRef).then((rawData) => {
                    if (rawData.exists()) {
                       const data = rawData.data()
                        const playersArray: Player[] = Object.entries(data.players || {})
                        .map(([key, value]: [string, any]) => ({
                          name: value.name || '',
                          buyIn: Number(value.buyIn) || 0,
                          buyOut: Number(value.buyOut) || 0,
                          member: value.member || false,
                          uid: value.uid || null
                        }));

                        const currSession: Session = {
                          sessionId: sessionId,
                          name: data.name || '',
                          date: data.date || '',
                          players: playersArray ,
                          totalBuyIn: data.totalBuyIn || 0,
                          totalBuyOut: data.totalBuyOut || 0,
                          bigBlind: data.bigBlind || 0,
                          smallBlind: data.smallBlind || 0,
                          parentHostId: data.parentHostId || '',
                          hostUid: data.hostUid || ''
                        };
                        console.log(currSession)
                        sessions.value.push(currSession);

                    }

                })

            }


        }


        onMounted(() => {
          fetchHouseSessions(db, houseId.value);
        });


        const handleLoggedInChnage = (value: boolean) => {
            isLoggedIn.value = value
        }



        return {
          houseId,
          sessions,
          selectedSession,
          newSessionFlag,
          isLoggedIn,
          handleLoggedInChnage
        }
      }
})
</script>

