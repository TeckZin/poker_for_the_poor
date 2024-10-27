<template>
  <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
  </div>
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
    houseId: {
        type: String,
        required: true
    }

  },
  name: 'ViewHousePage',
  setup(props) {
    const route = useRoute();
    const router = useRouter()
    const db = getFirestore();

    console.log(props.houseId)


    return {

    }
  }
})
</script>
