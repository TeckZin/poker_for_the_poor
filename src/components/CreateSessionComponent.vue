<template>
    <div class="w-full flex flex-row h-[70vh]"> <!-- Set overall container height -->
        <div class="flex flex-col w-1/4 mr-[5vw]">
            <div class="overflow-y-auto flex-grow">
                <div :class="[infoDivClass]">
                    <label :class="[infoLabelClass]" for='date'>Date: </label>
                    <input :class="[infoInputClass]" v-model="session.Date" type="date" />
                </div>
                <div :class="[infoDivClass]">
                    <label :class="[infoLabelClass]" for='totalBuyIn'>Total Buy In: </label>
                    <input :class="[infoInputClass]" v-model="totalBuyIn" type="number" />
                </div>
                <div :class="[infoDivClass]">
                    <label :class="[infoLabelClass]" for='totalBuyOut'>Total Buy Out: </label>
                    <input :class="[infoInputClass]" v-model="totalBuyOut" type="number" />
                </div>
                <div :class="[infoDivClass]">
                    <label :class="[infoLabelClass]" for='bigBlind'>Big Blind (BB): </label>
                    <input :class="[infoInputClass]" v-model="bigBlind" type="number" />
                </div>
                <div :class="[infoDivClass]">
                    <label :class="[infoLabelClass]" for='smallBlind'>Small Blind (SB): </label>
                    <input :class="[infoInputClass]" v-model="smallBlind" type="number" />
                </div>
            </div>
        </div>
        <div class="w-1/4 flex flex-col">
            <div class="overflow-y-auto scrollbar-hide flex-grow">
                <table class="w-full border-collapse leading-normal">
                    <thead class="text-[2vw] sticky top-0">
                        <tr>
                            <th :class="[thClass, 'w-1/2']">Player</th>
                            <th :class="[thClass, 'w-1/4']">In</th>
                            <th :class="[thClass, 'w-1/4']">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in amountOfPlayers" :key="i">
                            <td :class="[tdInputClass]"><input :class="[playerInfoThClass]" placeholder="Player Name" type="text"/></td>
                            <td :class="[tdInputClass]"><input :class="[playerInfoThClass]" placeholder="In" type="number"/></td>
                            <td :class="[tdInputClass]"><input :class="[playerInfoThClass]" placeholder="Out" type="number"/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button @click="addPlayerClick" class="mt-2 text-[1.5vw] text-button-text-color">Add Player</button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed } from 'vue'

interface Session {
  sessionId: string,
  Name: string,
  InValue: number[],
  OutValue: number[],
  Players: string[],
  Date: string,
}

export default defineComponent({
  name: 'CreateSessionComponent',
  props: {
  },
  setup() {
   const session: Ref<Session> = ref({
      sessionId: '',
      Name: '',
      InValue: [],
      OutValue: [],
      Players: [],
      Date: '',
    });
    const amountOfPlayers: Ref<number> = ref(2)
    const totalBuyIn: Ref<number> = ref(0)
    const totalBuyOut: Ref<number> = ref(0)
    const bigBlind: Ref<number> = ref(0)
    const smallBlind: Ref<number> = ref(0)
    const infoLabelClass = "text-[2.5vw]"
    const infoInputClass = "text-[2vw] bg-[#69747C] pl-2 rounded-xl "
    const infoDivClass = "flex flex-col justify-between"
    const thClass = "text-left"
    const tdInputClass = "pt-3 pr-3"
    const playerInfoThClass = "bg-[#69747C] rounded-lg text-[1.3vw] w-full pl-1.5"

    const addPlayerClick = () => {
        amountOfPlayers.value++
    }



    return {
        session,
        amountOfPlayers,
        infoInputClass,
        infoLabelClass,
        infoDivClass,
        thClass,
        tdInputClass,
        playerInfoThClass,
        totalBuyIn,
        totalBuyOut,
        bigBlind,
        smallBlind,
        addPlayerClick,
    }
  }
})
</script>

