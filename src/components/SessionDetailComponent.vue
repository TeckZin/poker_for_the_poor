<template>
  <div class="flex text-[3vh] w-full h-full">
    <div class="w-1/4 h-full" v-if="session">
      <p>session id: {{ session.sessionId }}</p>
      <p>session name: {{ session.Name }}</p>
      <p>session date: {{ session.Date }}</p>
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
          <tr v-for="(player, index) in session.Players" :key="index">
            <td>{{ player }}</td>
            <td>{{ session.InValue[index] }}</td>
            <td>{{ session.OutValue[index] }}</td>
            <td>{{ getProfit(index) }}</td>
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

interface Session {
  sessionId: string,
  Name: string,
  InValue: number[],
  OutValue: number[],
  Players: string[],
  Date: string,
}

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


    const getProfit = (index: number): number => {
      if (props.session) {
        return props.session.OutValue[index] - props.session.InValue[index]
      }
      return 0
    }

    return {
      thClass,
      getProfit,
    }
  }
})
</script>
