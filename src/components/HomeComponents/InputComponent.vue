<template>
  <div class='text-[4vw] flex flex-col'>
      <div  v-if="homeView"
          class='flex flex-row text-button-text-color'>
          <button
              @click="(event) => handleClick('HOUSE')"
              :class="[buttonClass, 'mr-3']">HOUSE</button>
          <button
              @click="(event) => handleClick('PLAYER')"
              :class="[buttonClass, 'ml-3']">PLAYER</button>
      </div>
      <div v-if="searchHouseFlag" class='flex flex-col'>
          <div class="flex flex-row justify-between">
              <label> House Id </label>
              <div class="flex flex-row">
                  <button
                          @click="(event) => handleClick('BACK')"
                          :class="[backButtonClass, 'justify-start mr-2']"
                          >BACK</button>
                  <button
                          @click="handleSearchHouse"
                          :class="[backButtonClass, 'justify-start ml-2']"
                          >Search</button>
              </div>
          </div>
          <input
            @keyup.enter="handleSearchHouse"
          class='text-[0.75em] text-[#FCF0CC]
          font-ibm-plex-mono
          rounded-xl bg-[#545454] border-2
          outline-none p-2 border-white'
                 v-model="houseId"
                 />
      </div>
      <div v-if="searchPlayerFlag" class='flex flex-col'>
         <div class="flex flex-row justify-between">
                      <label> Player Id or Username </label>
                      <div class="flex flex-row">
                          <button
                                  @click="(event) => handleClick('BACK')"
                                  :class="[backButtonClass, 'justify-start mr-2']"
                                  >BACK</button>
                          <button
                                  @click="handeSearchPlayer"
                                  :class="[backButtonClass, 'justify-start ml-2']"
                                  >Search</button>
                      </div>
                  </div>
                  <input
                    @keyup.enter="handleSearchPlayer"
                  class='text-[0.75em] text-[#FCF0CC]
                  font-ibm-plex-mono
                  rounded-xl bg-[#545454] border-2
                  outline-none p-2 border-white'
                         v-model="playerID"
                         />

             </div>
      <div class='text-[#F0544F] font-[3rem]' v-if="errorFlag">
          <p> {{ errorMessage }} </p>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';



export default defineComponent({
  name: 'InputComponent',
  props: {
    // Define props here
  },
 setup() {
    const router = useRouter()

    const houseId = ref('')
    const searchHouseFlag = ref(false)
    const searchPlayerFlag = ref(false)
    const playerID = ref('')


    const homeView = ref(true)
    const buttonClass = ref('text-[1.3em]')
    const backButtonClass = ref('text-3vw')
    const errorFlag = ref(false)
    const errorMessage = ref('')

    const handleClick = (type: string) => {
      if (type === "HOUSE") {
        searchHouseFlag.value = true
        searchPlayerFlag.value = false
        homeView.value = false
      } else if (type === "PLAYER") {
        searchHouseFlag.value = false
        searchPlayerFlag.value = true
        homeView.value = false
      } else if (type === "BACK") {
        homeView.value = true
        searchHouseFlag.value = false
        searchPlayerFlag.value = false
      }
    }

    const handleSearchPlayer = async () => {
        console.log()

    }

    const handleSearchHouse = async () => {
      if (houseId.value) {
        const db = getFirestore()
        try {
          const tokenDocRef = doc(db, 'house_ids', houseId.value)
          const docSnap = await getDoc(tokenDocRef)

          if (docSnap.exists()) {
            router.push({
              name: 'HousePage',
              params: { houseId: houseId.value }
            })
            return
          } else {
            errorFlag.value = true
            errorMessage.value = 'House ID Does Not Exist'
            return
          }
        } catch (error) {
          console.error("Error fetching document:", error)
        }
      } else {
        errorFlag.value = true
        errorMessage.value = 'Enter Valid House Id'
      }
    }

    // Return all reactive refs and methods
    return {
      houseId,
      searchHouseFlag,
      searchPlayerFlag,
      homeView,
      buttonClass,
      backButtonClass,
      errorFlag,
      errorMessage,
      handleClick,
      playerID,
      handleSearchHouse,
      handleSearchPlayer,
    }
  },
})
</script>

<style scoped>
/* Component styles go here */
</style>

