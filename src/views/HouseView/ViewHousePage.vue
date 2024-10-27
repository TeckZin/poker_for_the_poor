<template>
  <div class="flex flex-row ml-10 justify-top font-bebas-neue w-full">
      <div class="flex flex-row justify-between w-full">
          <div :class="[divClass, 'w-1/3']">
              <p :class="[titleClass]"> Recent Sessions </p>
              <SessionsHouseListComponent
                    @sessions="sessions"
              > </SessionsHouseListComponent>
          </div>

          <div :class="[divClass, 'w-2/3']">
              <p :class="[titleClass]"> House Stats </p>
              <HouseStatsComponent> </HouseStatsComponent>
          </div>

      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session, Sessions } from '@/models/SessionTypes'
import { House, createEmptyHouse } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'
import HouseStatsComponent from '@/components/HouseComponents/HouseStatsComponent.vue'
import SessionsHouseListComponent from '@/components/SessionComponents/SessionsHouseListComponent.vue'

export default defineComponent({
  components: {
    HouseStatsComponent,
    SessionsHouseListComponent,
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


    const sessions = ref<Session[]>([]);


    const currHouse: Ref<House> = ref(createEmptyHouse())


    const divClass = ""
    const titleClass = "text-[2vw]"


    const fetchSession = async () => {
        console.log()

    }

    const fetchSessions = async () => {
        console.log()
    }

    const fetchHouse = async () => {
        console.log()
        try {
            const houseDocRef = doc(db, 'house_ids', props.houseId)
            const houseSnap = await getDoc(houseDocRef)
            if (houseSnap.exists()) {
                currHouse.value = houseSnap.data() as House


            }


        } catch (error) {
            console.error(error)

        }


    }


    onMounted(async () => {
        await fetchHouse()
        console.log(currHouse.value)



    })



    return {
        divClass,
        titleClass,
        sessions

    }
  }
})
</script>
