<template>
  <div class="flex text-[3vh] w-full h-full">
    <div class="w-full h-full" v-if="session">
      <p>session id: {{ session.sessionId }}</p>
      <p>session name: {{ session.mame }}</p>
      <p>session date: {{ session.date }}</p>
      <table class="table-auto w-full">
        <thead class="text-[2vw]">
          <tr>
            <th :class="[thClass]">Player</th>
            <th :class="[thClass]">In</th>
            <th :class="[thClass]">Out</th>
            <th :class="[thClass]">Profit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in session.players" :key="index">

            <td>{{ player.username }}</td>
            <td>{{ player.buyIn }}</td>
            <td>{{ player.buyOut }}</td>
            <td>{{ player.buyOut - player.buyIn }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="isLoggedIn" class="flex flex-row justify-evenly
                  text-button-text-color">
          <button :class="[buttonClass, 'px-4 py-1.5']"
                             @click="handleEditClick"
              >EDIT</button>
          <button :class="[buttonClass, 'px-3 py-2']">VIEW MORE</button>
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <p class="text-[4vw] font-bold">PICK A SESSION</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, onMounted} from 'vue'
import {Session} from '@/models/SessionTypes'
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'SessionDetailComponent',
  props: {
    session: {
      type: Object as PropType<Session | null>,
      required: false,
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
    }
  },
  setup(props) {
    const router = useRouter()
    const thClass = ref("text-left")
    const buttonClass = "button-custom-hover-class text-[2vw]"


    const handleEditClick = () => {
        router.push({name: 'EditSessionPage', params: {sessionId: props.session?.sessionId ?? ''}})
    }



    return {
      thClass,
      buttonClass,
      handleEditClick,
    }
  }
})
</script>
