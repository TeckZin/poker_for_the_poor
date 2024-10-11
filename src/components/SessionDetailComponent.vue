<template>
  <div class="flex text-[3vh] w-full h-full">
    <div class="w-1/4 h-full" v-if="session">
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
            <td>{{ player.name }}</td>
            <td>{{ player.buyIn }}</td>
            <td>{{ player.buyOut }}</td>
            <td>{{ player.buyOut - player.buyIn }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="isLoggedIn" class="flex justify-start text-button-text-color">
          <button>EDIT</button>
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <p class="text-[4vw] font-bold">PICK A SESSION</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, onMounted} from 'vue'
import {Session} from '../models/sessionTypes'



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
    const thClass = ref("text-left")



    return {
      thClass,
    }
  }
})
</script>
