<template>
    statas
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session, Sessions } from '@/models/SessionTypes'
import { House } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'

export default defineComponent({
  components: {
  },
  props: {
  },
  name: 'HouseStatsComponents',
  setup(props) {
    const route = useRoute();
    const router = useRouter()
    const db = getFirestore();


    const divClass = ""
    const titleClass = "text-[2vw]"


    return {
        divClass,
        titleClass

    }
  }
})
</script>
