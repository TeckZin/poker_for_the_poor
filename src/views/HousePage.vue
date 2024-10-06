<template>
  <div class="flex flex-col ml-10 justify-top  font-bebas-neue w-full">
      <p class="text-[2vw]"> House Id: {{ houseId }} </p>
      <div class="flex flex-row">
          <div :class="newSessionFlag ? 'w-full' : 'w-1/4'">
              <div>
                  <p class="text-[4vw]"> Sessions </p>
                  <div v-if="!newSessionFlag">
                      <button @click="onCreateClick" class="text-[2vw] text-[#FCF0CC]" > Create New Session </button>
                  </div>
                  <div v-if="newSessionFlag">
                      <button @click="onCreateBackClick" class="text-[2vw] text-[#FCF0CC]" >BACK</button>
                      <CreateSessionComponent> </CreateSessionComponent>
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
              <SessionDetailComponent :session="selectedSession"> </SessionDetailComponent>
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



        return {
          houseId,
          sessions,
          selectedSession,
          newSessionFlag
        }
      }
})
</script>

