<template>
        <div class="w-full">
            <ul>
                <li v-for="house in houses" :key="house.houseId" :class="[liClass]">
                    <div class="flex flex-col">
                        <div :class="[liDivClass]">
                            <p class="mx-3"> House Name: </p>
                            <p>{{house.name}} </p>
                        </div>
                        <div :class="[liDivClass]">
                            <p class="mx-3"> House Id: </p>
                            <p>{{house.houseId}} </p>
                        </div>

                    </div>
                    <button class="mr-6 text-button-text-color "
                            @click="handleViewMoreClick(house)" >
                        VIEW MORE
                    </button>
                </li>
            </ul>


        </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, PropType, watch } from 'vue'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, DocumentReference, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { House } from '../models/houseTypes'
import { PlayerMember } from '../models/playerTypes'

export default defineComponent({
  components: {
  },
  props: {
    currUser: {
        type: Object as PropType<PlayerMember>,
        required: true
    }

  },
  name: 'HostedHouseListComponent',
    setup(props, { emit }) {
        const errorMessage = ref('')
        const houses = ref<House[]>([])
        const db = getFirestore()
        const router = useRouter()

        const liClass = "flex flex-row justify-between text-[1.5vw] border border-white my-6"
        const liDivClass = "flex flex-row"

        const handleViewMoreClick = (house: House) => {
            router.push({ name: 'HousePage', params: {houseId: house.houseId}})

        }

        const getHostedHouse = async (houseRef: DocumentReference): Promise<House | null> => {
          try {
            const houseSnap = await getDoc(houseRef)
            if (houseSnap.exists()) {
              return {
                ...houseSnap.data(),
                houseId: houseSnap.id
              } as House
            }
            return null
          } catch (error) {
            console.error('Error fetching house:', error)
            errorMessage.value = 'Failed to fetch house details'
            return null
          }
        }

        const getHostedHouses = async () => {
          try {
            if (!props.currUser?.houseGamesHosted || !props.currUser?.houseGamesHostedRef) {
              houses.value = []
              return
            }

            const housePromises = props.currUser.houseGamesHostedRef.map(ref =>
              getHostedHouse(ref)
            )

            const results = await Promise.all(housePromises)
            houses.value = results.filter((house): house is House => house !== null)
          } catch (error) {
            console.error('Error fetching hosted houses:', error)
            errorMessage.value = 'Failed to fetch hosted houses'
            houses.value = []
          }
        }

        // Watch for changes in currUser
        watch(() => props.currUser, () => {
          getHostedHouses()
        }, { immediate: true })

        return {
          houses,
          errorMessage,
          getHostedHouses,
          liClass,
          liDivClass,
          handleViewMoreClick,
        }
      },
})
</script>

