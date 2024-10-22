<template>
  <div class="flex flex-col items-center justify-center h-screen ">
    <h1 class="text-6xl font-['Bebas_Neue'] mb-4">404 Not Found</h1>
    <router-link
      to="/"
      class="text-[2vw] font-['Bebas_Neue'] px-3 py-2 text-button-text-color
             hover:border-4 hover:border-white transition-all duration-300"
    >
      Go to Home
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFoundPage',
})
</script>
