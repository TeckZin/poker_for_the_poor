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
                              <td>{{ session.Date }}</td>
                              <td>{{ session.Name }}</td>
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
import { getFirestore, collection, getDocs, doc, Firestore } from "firebase/firestore";
import { useRoute } from 'vue-router'
import SessionDetailComponent from '../components/SessionDetailComponent.vue'
import CreateSessionComponent from '../components/CreateSessionComponent.vue'
import SignOutBarComponent from '../components/SignOutBarComponent.vue'

interface Session {
    sessionId: string,
    Name: string,
    InValue: number[],
    OutValue: number[],
    Players: string[],
    Date: string,

}
interface Sessions {
    sessions: Session[];
}

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

        const isLoggedIn = ref(true)

        const fetchSessions = async (db: Firestore, houseId: string) => {
          try {
            const houseDocRef = doc(db, "HouseID", houseId);
            const sessionsCollectionRef = collection(houseDocRef, "sessions");
            const sessionsSnapshot = await getDocs(sessionsCollectionRef);

            const fetchedSessions: Session[] = sessionsSnapshot.docs.map(doc => ({
              ...doc.data(),
              sessionId: doc.id
            } as Session));

            sessions.value = fetchedSessions;
          } catch (error) {
            console.error("Error fetching sessions:", error);
          }
        };

        onMounted(() => {
          fetchSessions(db, houseId.value);
        });


        const handleLoggedInChnage = (value: boolean) => {
            console.log(value)
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

