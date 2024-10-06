<template>
    <div class="w-full flex flex-row">
        <div class="flex flex-col justify-between w-1/4">
            <div :class="[infoDivClass]">
                <label :class="[infoLabelClass]" for='date'>Date: </label>
                <input  :class="[infoInputClass]"
                v-model="session.Date" type="date" />
            </div>
            <div :class="[infoDivClass]">
                <label :class="[infoLabelClass]" for='totalBuyIn'>Total Buy In:
                </label>
                <input  :class="[infoInputClass]"
                v-model="totalBuyIn" type="number" />
            </div>
            <div :class="[infoDivClass]">
                <label :class="[infoLabelClass]" for='totalBuyOut'>Total Buy Out: </label>
                <input  :class="[infoInputClass]"
                v-model="totalBuyOut" type="number" />
            </div>
            <div :class="[infoDivClass]">
                <label :class="[infoLabelClass]" for='bigBlind'>Big Blind (BB): </label>
                <input  :class="[infoInputClass]"
                v-model="bigBlind" type="number" />
            </div>
            <div :class="[infoDivClass]">
                <label :class="[infoLabelClass]" for='smallBlind'>Small Blind (SB): </label>
                <input  :class="[infoInputClass]"
                v-model="smallBlind" type="number" />
            </div>
        </div>
        <div>
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
    const amountOfPlayers: Ref<number> = ref(0)
    const totalBuyIn: Ref<number> = ref(0)
    const totalBuyOut: Ref<number> = ref(0)
    const bigBlind: Ref<number> = ref(0)
    const smallBlind: Ref<number> = ref(0)
    const infoLabelClass = "text-[2.5vw]"
    const infoInputClass = "text-[2vw] bg-[#69747C] pl-2 rounded-xl "
    const infoDivClass = "flex flex-col justify-between"


    return {
        session,
        amountOfPlayers,
        infoInputClass,
        infoLabelClass,
        infoDivClass,
        totalBuyIn,
        totalBuyOut,
        bigBlind,
        smallBlind
    }
  }
})
</script>

