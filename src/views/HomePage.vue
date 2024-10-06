<template>
  <div class="flex flex-col ml-10 justify-center text-[13vw] font-bebas-neue">
      <p> Poker for the poor </p>
      <InputComponent> </InputComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InputComponent from '../components/InputComponent.vue'

export default defineComponent({
  components: {
      InputComponent,

  },
  name: 'HomePage',
  setup() {
    // Component logic can be added here
    return {}
  },
})
</script>

