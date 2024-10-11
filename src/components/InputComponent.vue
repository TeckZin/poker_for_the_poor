<template>
  <div class='text-[4vw] flex flex-col'>
      <div  v-if="homeView"
          class='flex flex-row text-button-text-color'>
          <button
              @click="(event) => handleClick('JOIN')"
              :class="[buttonClass, 'mr-3']">JOIN</button>
          <button
              @click="(event) => handleClick('NEW')"
              :class="[buttonClass, 'ml-3']">NEW</button>
      </div>
      <div v-if="joinHouseId" class='flex flex-col'>
          <div class="flex flex-row justify-between">
              <label> House Id </label>
              <div class="flex flex-row">
                  <button
                          @click="(event) => handleClick('BACK')"
                          :class="[backButtonClass, 'justify-start mr-2']"
                          >BACK</button>
                  <button
                          @click="handleJoinHouse"
                          :class="[backButtonClass, 'justify-start ml-2']"
                          >JOIN</button>
              </div>
          </div>
          <input class='text-[0.75em] text-[#FCF0CC]
          rounded-xl bg-[#545454] border-2
          outline-none p-2 border-white'
                 v-model="houseId"
                 />
      </div>
      <div v-if="createHouseId">
          <button
              @click="(event) => handleClick('BACK')"
              :class="[backButtonClass, 'mr-3']">BACK</button>
      </div>
      <div class='text-[#F0544F] font-[3rem]' v-if="errorFlag">
          <p> {{ errorMessage }} </p>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';



export default defineComponent({
  name: 'InputComponent',
  props: {
    // Define props here
  },
  setup(props) {
    // Component logic goes here

    return {
      // Return reactive data and methods
    }
  },
  data() {
    return {
        houseId: '',
        joinHouseId: false,
        createHouseId: false,
        homeView: true,
        buttonClass: 'text-[1.3em]',
        backButtonClass: 'text-3vw',
        errorFlag: false,
        errorMessage: '',

    }

  },
  methods: {
    handleClick(type: string): void {
        if (type === "JOIN") {
            this.joinHouseId = true
            this.createHouseId = false
            this.homeView = false
        } else if (type === "NEW") {
            this.createHouseId = true
            this.joinHouseId = false
            this.homeView = false
        } else if (type === "BACK") {
            this.homeView = true
            this.createHouseId = false
            this.joinHouseId = false
        }
    },

    handleJoinHouse(): void {


        if (this.houseId) {
                const db = getFirestore();
                const fetchSpecificToken = async () => {
                  const tokenDocRef = doc(db, 'house_ids', this.houseId);
                  try {
                    const docSnap = await getDoc(tokenDocRef);
                    if (docSnap.exists()) {
                        this.$router.push({ name: 'HousePage', params: { houseId: this.houseId} })
                        return
                    } else {
                        console.log("No such document!");
                        this.errorFlag = true
                        this.errorMessage = 'House ID Does Not Exist'
                        return
                    }
                  } catch (error) {
                    console.error("Error fetching document:", error);
                  }
                };


                fetchSpecificToken()

        } else {
            this.errorFlag = true
            this.errorMessage = 'Enter Valid House Id'

        }
    }

  }
})
</script>

<style scoped>
/* Component styles go here */
</style>

