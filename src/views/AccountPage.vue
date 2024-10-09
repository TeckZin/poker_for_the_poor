<template>
    <div>

      <SignOutBarComponent> </SignOutBarComponent>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import SignOutBarComponent from '../components/SignOutBarComponent.vue'

export default defineComponent({
  components: {
      SignOutBarComponent,
  },
  name: 'AccountPage',
  setup(props, {emit}) {
    // Component logic can be added here

    return {

    }
  },
})
</script>

