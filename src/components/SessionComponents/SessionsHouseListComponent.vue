<template>
  <div class="flex flex-col justify-top font-bebas-neue w-full">
          <table class="w-full table-auto">
            <thead class="text-[2vw] w-full">
              <tr>
                <th :class="[thClass]">Date</th>
                <th :class="[thClass]">Name</th>
                <th :class="[thClass]"><button> View </button></th>
              </tr>
            </thead>
            <tbody class="text-[1.5vw] w-full">
              <tr v-for="session in sessions" :key="session.sessionId">
                <td>{{ session.date }}</td>
                <td>{{ session.name }}</td>
                <td class='text-[#FCF0CC]'> <button @click="() => viewMoreSessionClick(session)">VIEW MORE</button></td>
              </tr>
            </tbody>
          </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, PropType } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session } from '@/models/SessionTypes'
import { House } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'

export default defineComponent({
  components: {
  },
  props: {
    sessions: {
        type: Array as PropType<Session[]>,
        required: true
    }


  },
  name: 'SessionsHouseListComponent',
  setup(props, {emit}) {
    const route = useRoute();
    const router = useRouter()
    const db = getFirestore();
    const thClass = "text-left"
    const houseDivClass = "flex flex-row text-[2vw]"
    const housePClass = "mr-5"


    const viewMoreSessionClick = (session: Session) => {
        emit('selectedSession', session)

    }


    return {
        thClass,
        houseDivClass,
        housePClass,
        viewMoreSessionClick
    }
  }
})
</script>
