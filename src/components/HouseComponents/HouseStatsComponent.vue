<template>
    <p>{{houseId}} </p>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session, createEmptySessions } from '@/models/SessionTypes'
import { House, createEmptyHouse } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'

export default defineComponent({
  components: {
  },
  props: {
    houseId: {
        type: String,
        required: true

    }
  },
  name: 'HouseStatsComponents',
  setup(props) {
    const route = useRoute();
    const router = useRouter()
    const db = getFirestore();


    const divClass = ""
    const titleClass = "text-[2vw]"


    const house = ref(createEmptyHouse())
    const sessions = ref(createEmptySessions(0))


    const fetchHouseSesions = async () => {
        try {
            const houseDocRef = doc(db, 'house_ids', props.houseId)
            const houseSnap = await getDoc(houseDocRef)
            if(houseSnap.exists()){
                house.value = houseSnap.data() as House
            }


        } catch (error) {
            console.error(error)
        }

    }


    onMounted(async () => {
        await fetchHouseSesions()
        console.log(house.value.sessionsIds.length)
        sessions.value = createEmptySessions(house.value.sessionsIds.length)
        console.log(sessions.value)

    })


    return {
        divClass,
        titleClass

    }
  }
})
</script>
