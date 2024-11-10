<template>
  <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
      <div class="flex flex-row justify-between mt-3">
          <button class="text-[2.5vw]  text-button-text-color" @click="handleBackClick">
            back
          </button>
          <SignOutBarComponent
                  class="mr-7"
                  > </SignOutBarComponent>
      </div>
      <div class="flex flex-row justify-between w-full">
          <div :class="[divClass, 'w-1/3']">
              <p :class="[titleClass]"> Recent Sessions </p>
              <SessionsHouseListComponent
                    :sessions="sessions"
              > </SessionsHouseListComponent>
          </div>

          <div :class="[divClass, 'w-2/3']">
              <p :class="[titleClass]"> House Stats </p>
              <HouseStatsComponent
                      :houseId="houseId"
              > </HouseStatsComponent>
          </div>

      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore, DocumentSnapshot } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session, createEmptySessions } from '@/models/SessionTypes'
import { House, createEmptyHouse } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'
import HouseStatsComponent from '@/components/HouseComponents/HouseStatsComponent.vue'
import SessionsHouseListComponent from '@/components/SessionComponents/SessionsHouseListComponent.vue'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'

export default defineComponent({
  components: {
    HouseStatsComponent,
    SessionsHouseListComponent,
    SignOutBarComponent
  },
  props: {
    houseId: {
        type: String,
        required: true
    }

  },
  name: 'ViewHousePage',
  setup(props) {
    const route = useRoute();
    const router = useRouter()
    const db = getFirestore();


    const sessions: Ref<Session[]> = ref(createEmptySessions(0));


    const house: Ref<House> = ref(createEmptyHouse())


    const divClass = ""
    const titleClass = "text-[2vw]"



    const fetchSession = async () => {
        console.log()

    }

    const fetchSessions = async () => {
        try {
            const sessionSnapshot = await Promise.all(
                house.value.sessionsIdsRef.map(async ref => {
                    try {
                        return await getDoc(ref)

                    } catch (error) {
                        console.error(`Failed to fetch session: ${ref.id}`, error)
                        return null
                    }


                })
            )

            const finalSessions = sessionSnapshot
                .filter((snapshot): snapshot is DocumentSnapshot => snapshot !== null)
                .map(snapshot => {
                    if(snapshot.exists()) {
                            return snapshot.data() as Session


                    }
                    return null

                }).filter((session): session is Session => session !== null)


                if (finalSessions.length > 0) {
                    sessions.value = finalSessions

                }




        } catch (error) {
            console.error(error)

        }


    }


    const fetchHouse = async () => {
        console.log()
        try {
            const houseDocRef = doc(db, 'house_ids', props.houseId)
            const houseSnap = await getDoc(houseDocRef)
            if (houseSnap.exists()) {
                house.value = houseSnap.data() as House


            }


        } catch (error) {
            console.error(error)

        }


    }


    onMounted(async () => {
        await fetchHouse()
        await fetchSessions()
    })


    const handleBackClick = () => {
      router.go(-1)
    }

    return {
        divClass,
        titleClass,
        sessions,
        handleBackClick

    }
  }
})
</script>
